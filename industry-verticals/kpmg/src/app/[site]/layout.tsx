import { draftMode } from "next/headers";
import Bootstrap from "src/Bootstrap";
import { CdpProfileShellLoader } from "@/components/cdp-profile-panel/CdpProfileShellLoader";
import "components/cdp-profile-panel/cdp-profile-panel.css";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const { isEnabled } = await draftMode();

  return (
    <>
      <Bootstrap siteName={site} isPreviewMode={isEnabled} />
      {children}
      <CdpProfileShellLoader />
    </>
  );
}
