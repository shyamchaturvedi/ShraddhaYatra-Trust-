import React from 'react';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center transform hover:scale-105 transition-transform duration-300">
    <img src={member.image_url} alt={member.name} className="w-full h-60 object-cover object-center" />
    <div className="p-6">
      <h3 className="text-xl font-bold text-amber-900">{member.name}</h3>
      <p className="text-md font-semibold text-orange-600">{member.role}</p>
      <p className="text-gray-600 mt-2 text-sm">{member.responsibility}</p>
    </div>
  </div>
);

interface OurTeamViewProps {
  teamMembers: TeamMember[];
}

const OurTeamView: React.FC<OurTeamViewProps> = ({ teamMembers }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
            Our Dedicated Team
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            The guiding force behind Shraddha Yatra Trust's mission.
          </p>
        </div>
        
        {teamMembers.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
           <p className="text-center text-gray-600 mt-12 text-lg">Team information is not available at the moment. Please check back later.</p>
        )}
      </div>
    </div>
  );
};

export default OurTeamView;