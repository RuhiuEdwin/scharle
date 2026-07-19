// Next.js gives `template` a unique key per navigation, so this remounts
// on every route change — the CSS keyframe animations below (page-wipe,
// page-enter) simply replay because the elements are freshly created.
// No client JS needed for this part of the motion signature.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-wipe" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
