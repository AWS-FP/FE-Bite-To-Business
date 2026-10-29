export default function ProductAnimations() {
    return (
        <style>{`
        @keyframes reviewReveal {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btb-review-reveal { animation: reviewReveal 650ms cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes chatBubblePopUp {
          0% {
            opacity: 0;
            transform: translateY(26px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .chat-bubble-item {
          animation: chatBubblePopUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-bubble-item { animation: none; }
        }
      `}</style>
    );
}
