import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchFAQs } from "../api/FAQApi";

const titleMap = {
  "/what-to-wear/choose-your-institutions-regalia-guide":
    "Choose your Institution's Regalia Guide",
  "/what-to-wear/conjoint-degree-regalia": "Conjoint Degree Regalia",
  "/what-to-wear/general-regalia-guide": "General Regalia Guide",
  "/what-to-wear/gowns": "Gowns",
  "/what-to-wear/head-wear": "Head wear",
  "/what-to-wear/hoods-stoles-and-sash": "Hoods, Stoles and Sash",
  "/what-to-wear/korowai": "Korowai",
  "/what-to-wear/regalia-from-overseas-and-other-new-zealand-universities":
    "Regalia from Overseas and other New Zealand Universities",
  "/what-to-wear/sizes-and-fitting": "Sizes and Fitting",
  "/what-to-wear/massey-university-what-to-wear":
    "Massey University - What to wear",
  "/what-to-wear/ucol-what-to-wear": "UCOL - What to wear",
};

const sectionMap = {
  "/what-to-wear/choose-your-institutions-regalia-guide":
    "What to Wear.Choose your Institution's Regalia Guide",
  "/what-to-wear/massey-university-what-to-wear":
    "What to Wear.Massey University - What to wear",
  "/what-to-wear/ucol-what-to-wear": "What to Wear.UCOL - What to wear",
  "/what-to-wear/conjoint-degree-regalia":
    "What to Wear.Conjoint Degree Regalia",
  "/what-to-wear/general-regalia-guide": "What to Wear.General Regalia Guide",
  "/what-to-wear/gowns": "What to Wear.Gowns",
  "/what-to-wear/head-wear": "What to Wear.Head wear",
  "/what-to-wear/hoods-stoles-and-sash": "What to Wear.Hoods, Stoles and Sash",
  "/what-to-wear/korowai": "What to Wear.Korowai",
  "/what-to-wear/regalia-from-overseas-and-other-new-zealand-universities":
    "What to Wear.Regalia from Overseas and other New Zealand Universities",
  "/what-to-wear/sizes-and-fitting": "What to Wear.Sizes and Fitting",
};

const isTopLevelSectionTitleKey = (keyText) =>
  keyText.includes(".What Regalia to Hire.title") ||
  keyText.includes(".What to Wear for Diploma Recipients.title") ||
  keyText.includes(".Bachelor and Masters Degree Regalia.title") ||
  keyText.includes(".Doctoral Degree Regalia.title") ||
  keyText.includes(".Hood Colours - Arranged By Field of Study.title") ||
  keyText.includes(".Graduation Day.title") ||
  keyText.includes(".Advice from Previous Graduands.title") ||
  keyText.includes(".What to wear for UCOL Certificate Recipients.title") ||
  keyText.includes(".What to wear for UCOL Diploma Recipients.title") ||
  keyText.includes(".What to wear for UCOL Bachelor Degree Recipients.title") ||
  keyText.includes(
    ".What to wear for UCOL Graduate Certificates & Diplomas Recipients.title",
  ) ||
  keyText.includes(
    ".What to wear for UCOL Post Graduate Certificates & Diplomas Recipients.title",
  ) ||
  keyText.includes(
    ".What to wear for UCOL Bachelor Degrees with Honours Recipients.title",
  ) ||
  keyText.includes(".What to wear for UCOL Master Degrees Recipients.title") ||
  keyText.includes(".Hood & Stole Descriptions.title");

const getAnchorIdFromTitle = (title) =>
  `wtw-${String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

const renderTextWithLinks = (text) => {
  const regex =
    /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchedText = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    const isEmail = matchedText.includes("@");
    const href = isEmail
      ? `mailto:${matchedText}`
      : matchedText.startsWith("http")
        ? matchedText
        : `https://${matchedText}`;

    parts.push(
      <a
        key={`${matchedText}-${start}`}
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className="!text-amber-600 underline hover:!text-amber-700"
      >
        {matchedText}
      </a>,
    );

    lastIndex = start + matchedText.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};
const renderBlockContent = (block) => {
  const value = String(block.value || "");

  if (block.type === "text") {
    if (!value) return null;

    const keyText = String(block.key || "");
    const isTitleBlock = keyText.toLowerCase().endsWith(".title");

    if (isTitleBlock) {
      const isTopLevelTitle = isTopLevelSectionTitleKey(keyText);

      if (isTopLevelTitle) {
        return (
          <h2
            id={getAnchorIdFromTitle(value)}
            className="text-2xl font-semibold text-slate-900 mt-8 scroll-mt-24"
          >
            {value}
          </h2>
        );
      }

      return (
        <h3 className="text-base font-normal text-slate-900 mt-6">{value}</h3>
      );
    }
    return (
      <div className="space-y-3">
        {value.split(/\n\s*\n/).map((para, i) => (
          <p key={i} className="text-slate-700 leading-relaxed">
            {renderTextWithLinks(para)}
          </p>
        ))}
      </div>
    );
  }

  if (block.type === "list") {
    if (!value) return null;

    const parts = value.split(/\n\s*\n/).filter(Boolean);
    const isMenuBlock = String(block.key || "")
      .toLowerCase()
      .endsWith(".menu");

    return (
      <ul className="list-disc pl-6 space-y-1 text-slate-700">
        {parts.map((item, i) => (
          <li key={i}>
            {isMenuBlock ? (
              <a
                href={`#${getAnchorIdFromTitle(item)}`}
                className="!text-amber-600 hover:!text-amber-700 hover:underline"
              >
                {item}
              </a>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "link") {
    if (!value) return null;

    let parsedLink = null;
    try {
      parsedLink = JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse WhatToWear link JSON:", e);
      return null;
    }

    if (!parsedLink?.url) return null;

    const label = parsedLink.name || block.label || "More information";

    return (
      <a
        href={parsedLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sky-700 hover:underline"
      >
        <span>&gt;</span>
        <span>{label}</span>
      </a>
    );
  }

  if (block.type === "table") {
    if (!value) return null;

    let parsedTable = null;
    try {
      parsedTable = JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse WhatToWear table JSON:", e);
      return null;
    }

    if (
      !parsedTable ||
      !Array.isArray(parsedTable.columns) ||
      !Array.isArray(parsedTable.rows)
    ) {
      return null;
    }

    return (
      <div className="overflow-x-auto mt-3">
        <table className="w-full table-auto border-collapse overflow-hidden rounded-xl">
          <thead>
            <tr className="bg-slate-50 text-left">
              {parsedTable.columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-slate-600 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parsedTable.rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-3 text-slate-700 whitespace-pre-line"
                  >
                    {String(cell || "").replace(/\\n/g, "\n")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "image") {
    if (!value) return null;

    let parsedImage = null;
    try {
      parsedImage = JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse WhatToWear image JSON:", e);
      return null;
    }

    if (!parsedImage?.url) return null;

    const keyText = String(block.key || "");
    const isKorowaiImage = keyText === "korowai.image";

    return (
      <div className={isKorowaiImage ? "mt-4" : "flex justify-end"}>
        <img
          src={parsedImage.url}
          alt={parsedImage.alt || block.label || "Image"}
          className={isKorowaiImage ? "w-full max-w-2xl h-auto" : "w-40 h-auto"}
        />
      </div>
    );
  }

  return null;
};

export default function WhatToWearGuidePage() {
  const location = useLocation();
  const pathname = location.pathname;
  const title = titleMap[pathname] || "What to Wear Guide";
  const sectionName = sectionMap[pathname] || "";
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const groupedSections = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    blocks.forEach((block) => {
      const keyText = String(block.key || "");

      if (isTopLevelSectionTitleKey(keyText)) {
        currentGroup = {
          id: block.id,
          titleBlock: block,
          items: [block],
        };
        groups.push(currentGroup);
      } else if (currentGroup) {
        currentGroup.items.push(block);
      } else {
        groups.push({
          id: `loose-${block.id}`,
          titleBlock: null,
          items: [block],
        });
      }
    });

    return groups;
  }, [blocks]);

  const isInstitutionGuidePage =
    pathname === "/what-to-wear/choose-your-institutions-regalia-guide";
  const isGownsPage = pathname === "/what-to-wear/gowns";
  const isHeadWearPage = pathname === "/what-to-wear/head-wear";
  const isHoodsStolesSashPage =
    pathname === "/what-to-wear/hoods-stoles-and-sash";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchFAQs();
        const array = Array.isArray(data) ? data : [];

        const getBlockOrder = (item) => {
          const key = String(item.key || "");

          if (key === "page.title") return 1;
          if (key === "page.intro") return 2;
          if (key === "page.menu") return 3;

          if (key === "gowns.bachelor.title") return 101;
          if (key === "gowns.bachelor.list") return 102;
          if (key === "gowns.bachelor.image") return 103;

          if (key === "korowai.image") return 101;
          if (key === "korowai.intro1") return 102;
          if (key === "korowai.intro2") return 103;
          if (key === "korowai.intro3") return 104;
          if (key === "korowai.intro4") return 105;
          if (key === "korowai.intro5") return 106;
          if (key === "korowai.intro6") return 107;

          if (key === "gowns.masters.title") return 201;
          if (key === "gowns.masters.list") return 202;
          if (key === "gowns.masters.image") return 203;

          if (key === "gowns.doctoral.title") return 301;
          if (key === "gowns.doctoral.list") return 302;
          if (key === "gowns.doctoral.image") return 303;

          if (key === "gowns.higher-doctoral.title") return 401;
          if (key === "gowns.higher-doctoral.list") return 402;
          if (key === "gowns.higher-doctoral.image") return 403;

          return 1000 + Number(item.id || 0);
        };

        const currentBlocks = array
          .filter((item) => item.section === sectionName)
          .sort((a, b) => getBlockOrder(a) - getBlockOrder(b));
        if (!cancelled) {
          setBlocks(currentBlocks);
        }
      } catch (e) {
        console.error("Failed to load What to Wear content:", e);
        if (!cancelled) {
          setError("Failed to load page content.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sectionName]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div id="wtw-top" className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>

        {isInstitutionGuidePage ? (
          <div className="mt-6">
            {loading && (
              <p className="text-slate-600 leading-relaxed">Loading...</p>
            )}

            {!loading && error && (
              <p className="text-red-600 leading-relaxed">{error}</p>
            )}

            {!loading && !error && blocks.length > 0 && (
              <div className="space-y-6">
                {groupedSections.map((group) => {
                  const hasTopLevelTitle =
                    group.titleBlock &&
                    isTopLevelSectionTitleKey(
                      String(group.titleBlock.key || ""),
                    );

                  return (
                    <div key={group.id} className="space-y-4">
                      {group.items.map((block) => (
                        <div key={block.id}>{renderBlockContent(block)}</div>
                      ))}

                      {hasTopLevelTitle && (
                        <div className="mt-3">
                          <a
                            href="#wtw-top"
                            className="text-sky-700 text-sm font-medium uppercase tracking-wide hover:underline"
                          >
                            BACK TO TOP &gt;
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && !error && blocks.length === 0 && (
              <p className="text-slate-700 leading-relaxed">
                Please choose your Institution from the list below to find out
                exactly what they will require you to wear so you can order to
                hire or purchase our regalia with confidence!
              </p>
            )}

            <div className="mt-8 space-y-5">
              <Link
                to="/what-to-wear/massey-university-what-to-wear"
                className="block text-amber-600 hover:underline"
              >
                &gt; Massey University - What to wear
              </Link>

              <Link
                to="/what-to-wear/ucol-what-to-wear"
                className="block text-amber-600 hover:underline"
              >
                &gt; UCOL - What to wear
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {loading && (
              <p className="text-slate-600 leading-relaxed">Loading...</p>
            )}

            {!loading && error && (
              <p className="text-red-600 leading-relaxed">{error}</p>
            )}

            {!loading && !error && blocks.length === 0 && (
              <div>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  This page is currently being developed.
                </p>

                <p className="mt-2 text-slate-600 leading-relaxed">
                  Detailed regalia guidance will be added here soon.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              blocks.length > 0 &&
              (isGownsPage ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "gowns.bachelor.title" ||
                            block.key === "gowns.bachelor.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter((block) => block.key === "gowns.bachelor.image")
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "gowns.masters.title" ||
                            block.key === "gowns.masters.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter((block) => block.key === "gowns.masters.image")
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "gowns.doctoral.title" ||
                            block.key === "gowns.doctoral.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter((block) => block.key === "gowns.doctoral.image")
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "gowns.higher-doctoral.title" ||
                            block.key === "gowns.higher-doctoral.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "gowns.higher-doctoral.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : isHeadWearPage ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "headwear.tudor-bonnets.title" ||
                            block.key === "headwear.doctoral-bonnet.title" ||
                            block.key === "headwear.doctoral-bonnet.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "headwear.doctoral-bonnet.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "headwear.trenchers.title" ||
                            block.key === "headwear.trenchers.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) => block.key === "headwear.trenchers.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : isHoodsStolesSashPage ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                              "hoods-stoles-sash.diploma-stoles-or-sash.title" ||
                            block.key === "hoods-stoles-sash.ucol-sash.title" ||
                            block.key === "hoods-stoles-sash.ucol-sash.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "hoods-stoles-sash.ucol-sash.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                              "hoods-stoles-sash.ucol-stoles.title" ||
                            block.key === "hoods-stoles-sash.ucol-stoles.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key === "hoods-stoles-sash.ucol-stoles.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                              "hoods-stoles-sash.massey-stoles.title" ||
                            block.key ===
                              "hoods-stoles-sash.massey-stoles.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                            "hoods-stoles-sash.massey-stoles.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                              "hoods-stoles-sash.degree-hoods.title" ||
                            block.key ===
                              "hoods-stoles-sash.bachelor-degree-hood.title" ||
                            block.key ===
                              "hoods-stoles-sash.bachelor-degree-hood.text" ||
                            block.key ===
                              "hoods-stoles-sash.bachelor-degree-hood.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                            "hoods-stoles-sash.bachelor-degree-hood.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                              "hoods-stoles-sash.master-degree-hood.title" ||
                            block.key ===
                              "hoods-stoles-sash.master-degree-hood.text" ||
                            block.key ===
                              "hoods-stoles-sash.master-degree-hood.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                            "hoods-stoles-sash.master-degree-hood.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                    <div className="space-y-4">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                              "hoods-stoles-sash.phd-hood-stole-facings.title" ||
                            block.key ===
                              "hoods-stoles-sash.phd-hood-stole-facings.list",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>

                    <div className="pt-6">
                      {blocks
                        .filter(
                          (block) =>
                            block.key ===
                            "hoods-stoles-sash.phd-hood-stole-facings.image",
                        )
                        .map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedSections.map((group) => {
                    const hasTopLevelTitle =
                      group.titleBlock &&
                      isTopLevelSectionTitleKey(
                        String(group.titleBlock.key || ""),
                      );

                    return (
                      <div key={group.id} className="space-y-4">
                        {group.items.map((block) => (
                          <div key={block.id}>{renderBlockContent(block)}</div>
                        ))}

                        {hasTopLevelTitle && (
                          <div className="mt-3">
                            <a
                              href="#wtw-top"
                              className="text-sky-700 text-sm font-medium uppercase tracking-wide hover:underline"
                            >
                              BACK TO TOP &gt;
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
