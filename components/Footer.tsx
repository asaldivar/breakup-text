import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col  items-center px-3 space-y-3 sm:mb-0 mb-3">
      {/* <div> */}
      Made with{" "}
      <Image
        src="/broken-heart.png"
        width={30}
        height={30}
        alt="love"
        className="mb-5 sm:mb-0"
      />
      by Poo Boi
    </footer>
  );
}
