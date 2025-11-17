(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ArticleContent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ArticleContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
'use client';
;
;
function ArticleContent(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "2d64141fec7ae50cb07fd9d6551ff0249c648bb5fc9d4c67a60b82f52f5170fa") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2d64141fec7ae50cb07fd9d6551ff0249c648bb5fc9d4c67a60b82f52f5170fa";
    }
    const { content } = t0;
    let t1;
    if ($[1] !== content) {
        t1 = content.split("\n").map(_ArticleContentAnonymous);
        $[1] = content;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "prose prose-lg max-w-none",
            children: t1
        }, void 0, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 28,
            columnNumber: 10
        }, this);
        $[3] = t1;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    return t2;
}
_c = ArticleContent;
function _ArticleContentAnonymous(paragraph, index) {
    if (paragraph.startsWith("# ")) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-3xl font-bold mt-8 mb-4 text-gray-900",
            children: paragraph.replace("# ", "")
        }, index, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 38,
            columnNumber: 12
        }, this);
    }
    if (paragraph.startsWith("## ")) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold mt-6 mb-3 text-gray-900",
            children: paragraph.replace("## ", "")
        }, index, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 41,
            columnNumber: 12
        }, this);
    }
    if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-bold mb-4 text-gray-900",
            children: paragraph.replace(/\*\*/g, "")
        }, index, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 44,
            columnNumber: 12
        }, this);
    }
    if (paragraph.match(/^\d+\./)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            className: "ml-6 mb-2 text-gray-800",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                dangerouslySetInnerHTML: {
                    __html: paragraph.replace(/^\d+\.\s*/, "")
                }
            }, void 0, false, {
                fileName: "[project]/components/ArticleContent.tsx",
                lineNumber: 47,
                columnNumber: 64
            }, this)
        }, index, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 47,
            columnNumber: 12
        }, this);
    }
    if (paragraph.startsWith("- ")) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            className: "ml-6 mb-2 text-gray-800",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                dangerouslySetInnerHTML: {
                    __html: paragraph.replace("- ", "")
                }
            }, void 0, false, {
                fileName: "[project]/components/ArticleContent.tsx",
                lineNumber: 52,
                columnNumber: 64
            }, this)
        }, index, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 52,
            columnNumber: 12
        }, this);
    }
    if (paragraph.trim() === "") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, index, false, {
            fileName: "[project]/components/ArticleContent.tsx",
            lineNumber: 57,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "mb-4 text-gray-800 leading-relaxed text-base",
        dangerouslySetInnerHTML: {
            __html: paragraph
        }
    }, index, false, {
        fileName: "[project]/components/ArticleContent.tsx",
        lineNumber: 59,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "ArticleContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_ArticleContent_tsx_8ac62a24._.js.map