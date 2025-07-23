import { memo } from "react";

const PageHeader = memo(({ title, subtitle, icon }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader; 