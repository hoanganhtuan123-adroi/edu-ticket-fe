interface ActionButtonsProps {
  ticketStatus: {
    text: string;
    color: string;
    disabled: boolean;
    message: string;
  };
}

const ActionButtons = ({ ticketStatus }: ActionButtonsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <div
          className={`text-center p-3 rounded-lg ${
            ticketStatus.disabled ? "bg-gray-100" : "bg-green-100"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              ticketStatus.disabled ? "text-gray-600" : "text-green-700"
            }`}
          >
            {ticketStatus.message}
          </p>
        </div>
      </div>
      <button
        className={`w-full py-3 rounded-lg font-medium transition-colors mb-3 ${
          ticketStatus.disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : `${ticketStatus.color} text-white hover:opacity-90`
        }`}
        disabled={ticketStatus.disabled}
      >
        {ticketStatus.text}
      </button>
      <button className="w-full border border-purple-700 text-purple-700 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
        Lưu sự kiện
      </button>
    </div>
  );
};

export default ActionButtons;
