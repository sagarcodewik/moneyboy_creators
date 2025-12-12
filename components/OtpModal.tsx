"use client";
import { useState } from "react";

type OtpModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
};

const OtpModal = ({ open, onClose, onSubmit }: OtpModalProps) => {
  const [otp, setOtp] = useState("");

  if (!open) return null;

  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        <h3>Verify OTP</h3>
        <p>Enter the OTP sent to your email.</p>

        <input
          type="text"
          maxLength={6}
          className="otp-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="otp-actions">
          <button className="otp-submit" onClick={() => onSubmit(otp)}>
            Verify OTP
          </button>
          <button className="otp-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .otp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .otp-modal {
          background: #fff;
          padding: 25px;
          border-radius: 10px;
          width: 350px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .otp-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-top: 15px;
          text-align: center;
          font-size: 18px;
          letter-spacing: 5px;
        }

        .otp-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .otp-submit {
          padding: 10px 15px;
          background: #000;
          color: #fff;
          border-radius: 6px;
        }

        .otp-cancel {
          padding: 10px 15px;
          background: #ccc;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default OtpModal;
