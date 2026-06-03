interface PropsType {
  text?: string;
}

export default function Hr({ text }: PropsType) {
  if (!text) return <hr className="border-border w-full" />;
  return (
    <div className="inline-flex w-full items-center gap-4 select-none">
      <hr className="border-border w-full" />
      <span className="text-sm font-normal whitespace-nowrap">{text}</span>
      <hr className="border-border w-full" />
    </div>
  );
}
