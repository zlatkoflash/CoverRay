import Image from "next/image";
import logo from "@/assets/images/logo.webp";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MobileButtonUploadPhoto from "@/app/Editor/Template/[template_slug]/ContentDevices/MobileButtonUploadPhoto";

export default function MobileHeader() {

  const router = useRouter();
  const pathname = usePathname();
  const isKonvaEditor = pathname?.includes('Editor/Template');

  return (
    <>
      <div className={isKonvaEditor ? "mobile-header for-editor" : "mobile-header"}>
        <Link href={"/"}>
          <Image src={logo} alt="Your Cover" />
        </Link>
        {
          isKonvaEditor && <MobileButtonUploadPhoto className="is-in-header" />
        }
      </div>
    </>
  );
}