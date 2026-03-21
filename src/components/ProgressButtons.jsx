// ProgressButtons.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./ProgressButtons.css";
import { useNavigate } from "react-router-dom";

function ProgressButtons({
  step,
  setStep,
  steps = [],
  prevPath,
  nextPath,
  selectedCourseId,
  selectedCeremonyId,
  showCeremony,
  cardOptionsComplete = true,
  hireTempKey,
  orderType: orderTypeProp,
}) {
  const navigate = useNavigate();

  const orderType = Number(
    orderTypeProp ?? localStorage.getItem("orderType") ?? 0,
  );
  const HIRE_TEMP_KEY = hireTempKey;

  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [pendingResolve, setPendingResolve] = useState(null);
  const [replaceReason, setReplaceReason] = useState("orderType");

  const handleConfirmReplace = () => {
    if (pendingResolve) pendingResolve(true);
    setPendingResolve(null);
    setReplaceDialogOpen(false);
  };

  const handleCancelReplace = () => {
    if (pendingResolve) pendingResolve(false);
    setPendingResolve(null);
    setReplaceDialogOpen(false);
  };

  const readCart = () => {
    try {
      const raw = localStorage.getItem("cart") || "[]";
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [cartData, setCartData] = useState(readCart);

  useEffect(() => {
    const syncCart = () => setCartData(readCart());

    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const cartCount = cartData.length;

  const stepsLen = Array.isArray(steps) ? steps.length : 0;

  useEffect(() => {
    localStorage.setItem("step", String(step));
  }, [step]);

  useEffect(() => {
    const handler = () => {
      JSON.parse(localStorage.getItem(HIRE_TEMP_KEY) || "{}");
    };

    window.addEventListener("hireStep1LoadFromCart", handler);
    return () => window.removeEventListener("hireStep1LoadFromCart", handler);
  }, [HIRE_TEMP_KEY]);

  useEffect(() => {
    const handler = () => {
      JSON.parse(localStorage.getItem("buyStep1Temp") || "{}");
    };

    window.addEventListener("buyStep1LoadFromCart", handler);
    return () => window.removeEventListener("buyStep1LoadFromCart", handler);
  }, []);

  const scrollTop = () =>
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  const isCartOptionsComplete = (items) =>
    (items || []).every((item) => {
      const opts = Array.isArray(item.options) ? item.options : [];
      if (opts.length === 0) return true;

      const selected = item.selectedOptions || {};
      return opts.every((opt) => {
        const label = opt?.label;
        const val = label ? selected[label] : null;
        return val !== undefined && val !== null && String(val).trim() !== "";
      });
    });

  const cartOptionsComplete = isCartOptionsComplete(cartData);

  const goPrev = () => {
    if (prevPath) {
      localStorage.setItem("step", String(step - 1));
      navigate(prevPath);
      scrollTop();
      return;
    }
    if (setStep && step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      localStorage.setItem("step", String(newStep));
      scrollTop();
    }
  };

  const confirmReplaceCartItems = () => {
    try {
      const prev = JSON.parse(localStorage.getItem("cart") || "[]");

      const existingItems = (Array.isArray(prev) ? prev : []).filter(
        (i) => !i.isDonation,
      );

      if (existingItems.length === 0) return Promise.resolve(true);

      const hasDifferentOrderType = existingItems.some(
        (item) => Number(item.orderType) !== orderType,
      );

      if (hasDifferentOrderType) {
        return new Promise((resolve) => {
          setReplaceReason("orderType");
          setPendingResolve(() => resolve);
          setReplaceDialogOpen(true);
        });
      }

      // for hire (orderType 1), check ceremony ID mismatch
      if (orderType === 1 && selectedCeremonyId) {
        const hasDifferentCeremony = existingItems.some(
          (item) =>
            item.ceremonyId &&
            Number(item.ceremonyId) !== Number(selectedCeremonyId),
        );

        if (hasDifferentCeremony) {
          return new Promise((resolve) => {
            setReplaceReason("ceremony");
            setPendingResolve(() => resolve);
            setReplaceDialogOpen(true);
          });
        }
      }
      // for hire (orderType 1), check ceremony ID mismatch
      if (orderType === 1 && selectedCourseId) {
        const hasDifferentCourse = existingItems.some(
          (item) =>
            item.courseId && Number(item.courseId) !== Number(selectedCourseId),
        );

        if (hasDifferentCourse) {
          return new Promise((resolve) => {
            setReplaceReason("course");
            setPendingResolve(() => resolve);
            setReplaceDialogOpen(true);
          });
        }
      }

      return Promise.resolve(true);
    } catch {
      return Promise.resolve(true);
    }
  };

  // --- Step-1 commit handlers ---
  const commitHireStep1ToCart = async () => {
    if (showCeremony && !selectedCeremonyId) {
      alert("Please select a ceremony.");
      return false;
    }

    if (!selectedCourseId) {
      alert("Please select a qualification.");
      return false;
    }

    if (!cardOptionsComplete) {
      alert(
        "Please select all required options for your items before proceeding.",
      );
      return false;
    }

    try {
      if (!(await confirmReplaceCartItems())) {
        return false;
      }

      const prev = JSON.parse(localStorage.getItem("cart") || "[]");
      const preserved = (Array.isArray(prev) ? prev : []).filter((i) => {
        if (i.isDonation) return true;
        if (Number(i.orderType) !== orderType) return false;
        if (orderType === 1 && selectedCeremonyId && i.ceremonyId) {
          if (Number(i.ceremonyId) !== Number(selectedCeremonyId)) return false;
        }
        if (orderType === 1 && selectedCourseId && i.courseId) {
          if (Number(i.courseId) !== Number(selectedCourseId)) return false;
        }
        return true;
      });

      const temp = JSON.parse(localStorage.getItem(HIRE_TEMP_KEY) || "{}");
      const displayedItems = Array.isArray(temp.displayedItems)
        ? temp.displayedItems
        : [];
      const tempOptions = temp?.itemOptions || {};
      const tempPurchase = temp?.purchaseTypeByUiId || {};

      if (displayedItems.length === 0) {
        alert("Please add at least one item before proceeding.");
        return false;
      }

      const hireCartItems = displayedItems.map((p) => {
        const uiId = p.uiId || `${selectedCourseId}-${p.id}`;
        const selectedOptions = tempOptions[uiId] || {};
        const isHiring = tempPurchase[uiId] ?? true;

        return {
          id: p.id,
          cartItemId: p.cartItemId ?? crypto.randomUUID(),
          name: p.name,
          category: p.category,
          description: p.description,
          pictureBase64: p.pictureBase64 ?? null,

          hirePrice: Number(p.hirePrice ?? p.price ?? 0) || 0,
          buyPrice: p.buyPrice ?? null,

          quantity: 1,
          options: p.options || [],
          selectedOptions,

          type: "individual",
          isHiring,
          isDonation: false,
          courseId: selectedCourseId,
          ceremonyId: selectedCeremonyId ?? null,
          uiId,
          orderType,
        };
      });

      localStorage.setItem("orderType", String(orderType));
      const updated = [...preserved, ...hireCartItems];
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));

      localStorage.removeItem("selectedCeremonyId");
      localStorage.removeItem("selectedCourseId");
      localStorage.removeItem("selectedPhotoCeremonyId");
      localStorage.removeItem("selectedPhotoCourseId");
      localStorage.removeItem(HIRE_TEMP_KEY);
      window.dispatchEvent(new Event("hireStep1Reset"));

      return true;
    } catch (e) {
      alert(e?.message || "Failed to process your selected items.");
      return false;
    }
  };

  const commitBuyStep1ToCart = async () => {
    if (!cardOptionsComplete) {
      alert(
        "Please add items and select all required options before proceeding.",
      );
      return false;
    }

    try {
      if (!(await confirmReplaceCartItems())) {
        return false;
      }

      const temp = JSON.parse(localStorage.getItem("buyStep1Temp") || "{}");
      const displayedItems = Array.isArray(temp.displayedItems)
        ? temp.displayedItems
        : [];
      const itemOptions = temp.itemOptions || {};

      if (displayedItems.length === 0) {
        alert("Please add at least one item before proceeding.");
        return false;
      }

      const prev = JSON.parse(localStorage.getItem("cart") || "[]");
      const preserved = (Array.isArray(prev) ? prev : []).filter(
        (i) => i.isDonation || Number(i.orderType) === orderType,
      );

      const buyCartItems = displayedItems.map((product) => {
        const selectedOptions = itemOptions[product.uiId] || {};
        const isDelivery = product.__kind === "delivery";
        const isSet = product.__kind === "set";

        return {
          id: product.id,
          name: product.name,
          category: product.category,
          description: product.description,
          pictureBase64: product.pictureBase64 ?? null,

          buyPrice: isDelivery ? 0 : Number(product.buyPrice ?? 0),
          hirePrice: null,

          quantity: 1,
          options: product.options || [],
          selectedOptions,

          type: isSet ? "set" : "individual",
          isHiring: false,
          isDonation: false,
          isDelivery,

          uiId: product.uiId,
          __kind: product.__kind,
          orderType,
        };
      });

      localStorage.setItem("orderType", String(orderType));
      localStorage.removeItem("selectedCeremonyId");
      localStorage.removeItem("selectedCourseId");
      localStorage.removeItem("selectedPhotoCeremonyId");
      localStorage.removeItem("selectedPhotoCourseId");

      // Deduplicate delivery — only one allowed
      const dedupedBuyItems = buyCartItems.reduce((acc, item) => {
        if (item.isDelivery) {
          if (!acc.some((i) => i.isDelivery)) acc.push(item);
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

      // Remove stale delivery from preserved when orderType is 2
      const cleanPreserved =
        orderType === 2 ? preserved.filter((i) => !i.isDelivery) : preserved;

      const updated = [...cleanPreserved, ...dedupedBuyItems];
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));

      localStorage.removeItem("buyStep1Temp");
      return true;
    } catch (e) {
      alert(e?.message || "Failed to process your selected items.");
      return false;
    }
  };

  const getBuyStep1HasItems = () => {
    try {
      const temp = JSON.parse(localStorage.getItem("buyStep1Temp") || "{}");
      const displayed = Array.isArray(temp.displayedItems)
        ? temp.displayedItems
        : [];
      return displayed.some((x) => x && x.__kind !== "delivery");
    } catch {
      return false;
    }
  };

  const buyStep1HasItems = getBuyStep1HasItems();

  // --- Config per orderType ---
  const cfg = useMemo(() => {
    const isHireLike = orderType === 1 || orderType === 3;
    const isBuy = orderType === 2;

    return {
      isHireLike,
      isBuy,

      step1Hint: isBuy
        ? "Please add items and select all required options before proceeding."
        : "Please select all required options for your items before proceeding...",

      cartHint:
        "Please select all required options for your cart items before proceeding.",

      disableNext: () => {
        if (step === stepsLen || step === 3) return true;

        if (isHireLike && step === 1) {
          return (
            (showCeremony && !selectedCeremonyId) ||
            !selectedCourseId ||
            !cardOptionsComplete
          );
        }

        if (isBuy && step === 1) {
          return !buyStep1HasItems || !cardOptionsComplete;
        }

        if ((isHireLike || isBuy) && step >= 2 && cartCount === 0) {
          return true;
        }

        if (
          (isHireLike || isBuy) &&
          step >= 2 &&
          cartCount > 0 &&
          !cartOptionsComplete
        ) {
          return true;
        }

        return false;
      },

      beforeNext: async () => {
        if (step !== 1) return true;
        if (isHireLike) return await commitHireStep1ToCart();
        if (isBuy) return await commitBuyStep1ToCart();
        return true;
      },
    };
  }, [
    orderType,
    step,
    stepsLen,
    showCeremony,
    selectedCeremonyId,
    selectedCourseId,
    cardOptionsComplete,
    cartCount,
    cartOptionsComplete,
    buyStep1HasItems,
  ]);

  const goNext = async () => {
    const ok = await cfg.beforeNext();
    if (!ok) return;

    if (nextPath) {
      localStorage.setItem("step", String(step + 1));
      navigate(nextPath);
      scrollTop();
      return;
    }

    if (setStep && step < stepsLen) {
      const newStep = step + 1;
      setStep(newStep);
      localStorage.setItem("step", String(newStep));
      scrollTop();
    }
  };

  const disableNext = cfg.disableNext();

  if (![1, 2, 3].includes(orderType)) return null;

  return (
    <div>
      {step === 1 && !cardOptionsComplete && (
        <div className="dropDownLabel">{cfg.step1Hint}</div>
      )}

      {step >= 2 && cartCount > 0 && !cartOptionsComplete && (
        <div className="dropDownLabel">{cfg.cartHint}</div>
      )}

      <div className="btns">
        {step === 3 && (
          <button className="btn prev" onClick={goPrev} disabled={step === 1}>
            Back
          </button>
        )}

        {step < 3 && (
          <button
            className={`btn next ${disableNext ? "disabled" : ""}`}
            onClick={goNext}
            disabled={disableNext}
          >
            {step === 1 ? "Add to Cart" : "Next"}
          </button>
        )}
      </div>

      {replaceDialogOpen && (
        <div className="dialog-overlay" onClick={handleCancelReplace}>
          <div
            className="dialog-box replace-cart-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">Replace cart items?</h3>
            </div>

            <div className="dialog-content">
              {replaceReason === "ceremony" ? (
                <>
                  <p>
                    Your cart already contains items from a different ceremony.
                  </p>
                  <p>
                    Continuing will replace those items and keep only donation
                    items.
                  </p>
                </>
              ) : replaceReason === "course" ? (
                <>
                  <p>
                    Your cart already contains items from a different
                    qualification.
                  </p>
                  <p>
                    Continuing will replace those items and keep only donation
                    items.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your cart already contains items from another order type.
                  </p>
                  <p>
                    Continuing will replace those items and keep only donation
                    items.
                  </p>
                </>
              )}
              <p>Do you want to continue?</p>
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                className="dialog-btn dialog-btn-secondary"
                onClick={handleCancelReplace}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dialog-btn dialog-btn-primary"
                onClick={handleConfirmReplace}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressButtons;
