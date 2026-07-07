"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItemWithDropdown } from "@/constants/navigation";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItemWithDropdown[];
};

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden border-b border-slate-200 bg-white shadow-lg md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="space-y-1 px-4 pb-6 pt-2">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isActive =
                pathname === item.href ||
                item.children?.some((child) => pathname === child.href.split("#")[0]);

              if (hasChildren) {
                const isExpanded = expandedItem === item.name;
                return (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedItem(isExpanded ? null : item.name)
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                        isActive
                          ? "text-orange-500"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#0b172a]",
                      )}
                      aria-expanded={isExpanded}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4"
                        >
                          {item.children?.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={onClose}
                              className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-[#0b172a]"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    pathname === item.href
                      ? "text-orange-500"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0b172a]",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
