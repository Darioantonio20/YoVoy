import { memo } from "react";
import BlurText from "./BlurText";

const PageHeader = memo(({ title, subtitle, icon }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4 gap-2">
        {icon && <span>{icon}</span>}
        <BlurText
          text={title}
          delay={500}
          animateBy="words"
          direction="top"
          className="text-4xl font-bold text-gray-100 text-center"
        />
      </div>
      {subtitle && (
        <p className="text-xl text-gray-100 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader; 