import OrganizerHeader from "@/components/organizer/layout/OrganizerHeader";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrganizerHeader />
      <div className="p-6">{children}</div>
    </>
  );
}
