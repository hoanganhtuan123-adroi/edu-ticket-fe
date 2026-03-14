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
    </div>
  );
};

export default ActionButtons;
