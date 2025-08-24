export default function CollboratorAvatarsSkeletions() {
  return Array.from({ length: 5 }).map((_, idx) => (
    <div
      className="bg-card size-9 shrink-0 rounded-full border"
      key={`avatar-skeletion-${idx}`}
      style={{
        left: idx > 0 ? 24 * idx : 0,
        zIndex: idx,
        position: idx > 0 ? "absolute" : "static",
      }}
    />
  ));
}
