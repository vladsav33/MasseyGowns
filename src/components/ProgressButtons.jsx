// ProgressButtons.jsx
import React, { useEffect, useMemo } from "react";
import "./ProgressButtons.css";
import { useNavigate } from "react-router-dom";
import { getItemsByCourseId } from "../services/HireBuyRegaliaService";

function ProgressButtons({
  step,
  setStep,
  steps,
  prevPath,
  nextPath,
  selectedCourseId,
  selectedCeremonyId,
  showCeremony,
  cardOptionsComplete = true,
  onEditItems,
}) {
  const navigate = useNavigate();

  const orderType = Number(localStorage.getItem("orderType") || 0);
  const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartCount = cartData?.length || 0;

  useEffect(() => {
    localStorage.setItem("step", String(step));
  }, [step]);

  useEffect(() => {
    const handler = () => {
      const temp = JSON.parse(localStorage.getItem("hireStep1Temp") || "{}");
    };

    window.addEventListener("hireStep1LoadFromCart", handler);
    return () => window.removeEventListener("hireStep1LoadFromCart", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      const temp = JSON.parse(localStorage.getItem("buyStep1Temp") || "{}");
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

  const buyOptionsComplete = isCartOptionsComplete(cartData);

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

  // --- Step-1 commit handlers (ONLY differences) ---
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
      const prev = JSON.parse(localStorage.getItem("cart") || "[]");
      const preserved = prev.filter((i) => i.isDonation || i.isHiring === true);

      const temp = JSON.parse(localStorage.getItem("hireStep1Temp") || "{}");
      const tempOptions = temp?.itemOptions || {};
      const tempPurchase = temp?.purchaseTypeByUiId || {};

      const data = await getItemsByCourseId(selectedCourseId);
      const hireList = Array.isArray(data) ? data : [];

      const hireCartItems = hireList.map((p) => {
        const uiId = `${selectedCourseId}-${p.id}`;
        const selectedOptions = tempOptions[uiId] || {};
        const isHiring = tempPurchase[uiId] ?? true;

        return {
          id: p.id,
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
          courseId: selectedCourseId,
          ceremonyId: selectedCeremonyId ?? null,
        };
      });

      const updated = [...preserved, ...hireCartItems];
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));

      localStorage.removeItem("selectedCeremonyId");
      localStorage.removeItem("selectedCourseId");
      localStorage.removeItem("selectedPhotoCeremonyId");
      localStorage.removeItem("selectedPhotoCourseId");
      localStorage.removeItem("hireStep1Temp");
      window.dispatchEvent(new Event("hireStep1Reset"));

      return true;
    } catch (e) {
      alert(
        e?.message || "Failed to load items for the selected qualification.",
      );
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
      const temp = JSON.parse(localStorage.getItem("buyStep1Temp") || "{}");
      const displayedItems = temp.displayedItems || [];
      const itemOptions = temp.itemOptions || {};

      if (displayedItems.length === 0) {
        alert("Please add at least one item before proceeding.");
        return false;
      }

      const prev = JSON.parse(localStorage.getItem("cart") || "[]");
      const preserved = prev.filter((i) => i.isDonation);

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
        };
      });

      const updated = [...preserved, ...buyCartItems];
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
    const displayed = Array.isArray(temp.displayedItems) ? temp.displayedItems : [];

    // Count only real products (ignore delivery)
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

      // showEditButton: isHireLike, 

      disableNext: () => {
        if (step === steps.length || step === 3) return true;

        if (isHireLike && step === 1) {
          return (
            (showCeremony && !selectedCeremonyId) ||
            !selectedCourseId ||
            !cardOptionsComplete
          );
        }

        if (isBuy && step === 1) return !buyStep1HasItems || !cardOptionsComplete;
        if (isBuy && step >= 2 && cartCount === 0) return true;
        if (isBuy && step >= 2 && cartCount > 0 && !buyOptionsComplete)
          return true;

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
    steps.length,
    showCeremony,
    selectedCeremonyId,
    selectedCourseId,
    cardOptionsComplete,
    cartCount,
    buyOptionsComplete,
  ]);

  const goNext = async () => {
    // if (step === 1) {
    //   localStorage.setItem("orderType", String(orderType));
    // }
    const ok = await cfg.beforeNext();
    if (!ok) return;

    if (nextPath) {
      localStorage.setItem("step", String(step + 1));
      navigate(nextPath);
      scrollTop();
      return;
    }

    if (setStep && step < steps.length) {
      const newStep = step + 1;
      setStep(newStep);
      localStorage.setItem("step", String(newStep));
      scrollTop();
    }
  };

  // const handleEdit = () => {
  //   const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  //   // --- HIRE / CASUAL: rebuild hireStep1Temp from cart ---
  //   if (orderType === 1 || orderType === 3) {
  //     const hireItems = cart.filter((i) => i.isDonation || i.isHiring === true);

  //     const itemOptions = {};
  //     const purchaseTypeByUiId = {};

  //     hireItems.forEach((i) => {
  //       // donation doesn't have course/item id relationship, skip if needed
  //       if (i.isDonation) return;

  //       // must match how you created uiId during commitHireStep1ToCart
  //       const uiId = `${i.courseId}-${i.id}`;
  //       itemOptions[uiId] = i.selectedOptions || {};
  //       purchaseTypeByUiId[uiId] = i.isHiring ?? true;
  //     });

  //     localStorage.setItem(
  //       "hireStep1Temp",
  //       JSON.stringify({ itemOptions, purchaseTypeByUiId }),
  //     );

  //     // set dropdown selections too (so ceremony/course shows selected)
  //     const firstRealHire = hireItems.find((i) => !i.isDonation);
  //     if (firstRealHire) {
  //       localStorage.setItem(
  //         "selectedCourseId",
  //         String(firstRealHire.courseId),
  //       );
  //       if (firstRealHire.ceremonyId) {
  //         localStorage.setItem(
  //           "selectedCeremonyId",
  //           String(firstRealHire.ceremonyId),
  //         );
  //       }
  //     }

  //     // tell step-1 to load from temp (you'll implement listener in step-1 page)
  //     window.dispatchEvent(new Event("hireStep1LoadFromCart"));
  //   }

  //   // --- BUY: rebuild buyStep1Temp from cart ---
  //   if (orderType === 2) {
  //     const buyItems = cart.filter((i) => !i.isDonation);

  //     const itemOptions = {};
  //     const displayedItems = buyItems.map((i) => {
  //       const uiId = i.uiId || `buy-${i.id}`;
  //       itemOptions[uiId] = i.selectedOptions || {};

  //       return {
  //         ...i,
  //         uiId,
  //         __kind:
  //           i.__kind ||
  //           (i.isDelivery
  //             ? "delivery"
  //             : i.type === "set"
  //               ? "set"
  //               : "individual"),
  //       };
  //     });

  //     localStorage.setItem(
  //       "buyStep1Temp",
  //       JSON.stringify({ displayedItems, itemOptions }),
  //     );

  //     window.dispatchEvent(new Event("buyStep1LoadFromCart"));
  //   }

  //   // move to step 1
  //   if (prevPath) {
  //     // if you have a dedicated route for step 1, navigate to that route
  //     localStorage.setItem("step", "1");
  //     navigate(prevPath); // ONLY if prevPath is actually step-1 route
  //   } else {
  //     setStep?.(1);
  //     localStorage.setItem("step", "1");
  //   }

  //   scrollTop();
  // };

  const disableNext = cfg.disableNext();

  // If orderType is not set, render nothing (optional safety)
  if (![1, 2, 3].includes(orderType)) return null;

  return (
    <div>
      {/* Step 1 hint */}
      {step === 1 && !cardOptionsComplete && (
        <div className="dropDownLabel">{cfg.step1Hint}</div>
      )}

      {/* Shared prev/next buttons */}
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
    </div>
  );
}

export default ProgressButtons;
