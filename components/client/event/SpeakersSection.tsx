import { Users } from "lucide-react";

interface Speaker {
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
}

interface SpeakersSectionProps {
  speakers: Speaker[];
}

const SpeakersSection = ({ speakers }: SpeakersSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-600" />
        Diễn giả ({speakers.length})
      </h3>
      <div className="space-y-4">
        {speakers.map((speaker, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            {/* Speaker Avatar */}
            <div className="shrink-0">
              {speaker.avatar ? (
                <img
                  src={speaker.avatar}
                  alt={speaker.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-avatar.jpg";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                  {speaker.name?.charAt(0)?.toUpperCase() || "D"}
                </div>
              )}
            </div>

            {/* Speaker Info */}
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Diễn giả:</span>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {speaker.name}
                  </h4>
                </div>
                {speaker.title && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Chức vụ:</span>
                    <p className="text-sm text-purple-600 font-medium">
                      {speaker.title}
                    </p>
                  </div>
                )}
              </div>
              {speaker.bio && (
                <div className="bg-white rounded-lg p-3 border border-purple-200 mt-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-600">Tiểu sử: </span>
                    {speaker.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakersSection;
