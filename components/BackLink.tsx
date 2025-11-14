'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackLink() {
  const pathname = usePathname();

  // Solo mostrar el link si no estamos en la raíz
  if (pathname === "/") return null;

  return (
    <div className="p-4">
      <Link href="/" className="text-blue-600 hover:underline">
        &larr; Back
      </Link>
    </div>
  );
}
