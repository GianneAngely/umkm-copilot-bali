import GerakGlobal from "../components/GerakGlobal";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function LandingLayout({ children }) {
  return (
    <>
      <GerakGlobal />
      <SiteHeader />
      <main id="isi">{children}</main>
      <SiteFooter />
    </>
  );
}
