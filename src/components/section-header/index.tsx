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
    <div className="flex w-full flex-col items-start justify-between space-y-8 select-none">
      <section className="w-full">
        <h2 className="text-3xl font-bold capitalize">{title}</h2>
        {_description}
      </section>
      <hr className="border-border w-full" />
      {children}
    </div>
  );
};

export default SectionHeader;
