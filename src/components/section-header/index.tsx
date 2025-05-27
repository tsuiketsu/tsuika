import type React from "react";

interface PropsType {
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
}

const SectionHeader = ({ title, description, children }: PropsType) => {
  const _description =
    typeof description === "string" ? (
      <p className="text-muted-foreground">{description}</p>
    ) : (
      description
    );

  return (
    <div className="flex w-full items-start justify-between select-none">
      <section className="w-full">
        <h2 className="text-2xl font-bold capitalize">{title}</h2>
        {_description}
      </section>
      {children}
    </div>
  );
};

export default SectionHeader;
