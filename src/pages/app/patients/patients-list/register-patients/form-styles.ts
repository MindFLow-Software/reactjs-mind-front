import type { CSSProperties } from "react"

export const inputCls =
    "h-[38px] border-slate-200 text-[13.5px] text-slate-900 placeholder:text-slate-400 " +
    "focus-visible:border-blue-600 focus-visible:ring-[3px] focus-visible:ring-blue-600/[.18]"

export const selectCls: CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2398a1b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat:   "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 30,
}

export const selectClassName =
    "flex h-[38px] w-full appearance-none rounded-[6px] border border-slate-200 bg-white px-3 " +
    "text-[13.5px] text-slate-900 transition-[border-color,box-shadow] " +
    "focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/[.18] cursor-pointer"
