import { memo } from 'react';
import BlurText from './BlurText';

const PageHeader = memo(
  ({ title, subtitle, icon, textColor = 'text-gray-900' }) => {
    return (
      <div className='text-center mb-12'>
        <div className='flex items-center justify-center mb-4 gap-2'>
          {icon && <span className={textColor}>{icon}</span>}
          <BlurText
            text={title}
            delay={500}
            animateBy='words'
            direction='top'
            className={`text-4xl font-bold text-center ${textColor}`}
          />
        </div>
        {subtitle && (
          <p className={`text-xl max-w-2xl mx-auto ${textColor}`}>{subtitle}</p>
        )}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export default PageHeader;
