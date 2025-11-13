

import React from 'react';
import { ABOUT_CONTENT } from '../constants';

const AboutView: React.FC = () => {
  const content = ABOUT_CONTENT; // Always use the correct, static content

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">{content.missionTitle}</h2>
          <p className="mt-2 text-3xl font-extrabold text-amber-900 sm:text-4xl">
            {content.mainTitle}
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {content.subtitle}
          </p>
        </div>
        <div className="mt-10 prose prose-lg prose-orange text-gray-600 mx-auto">
          <p>
            {content.body}
          </p>
          <h3>{content.visionTitle}</h3>
          <p>
            {content.visionBody}
          </p>
          <h3>{content.whatWeDoTitle}</h3>
          <ul>
            {content.whatWeDoPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <p>
            {content.closing}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;