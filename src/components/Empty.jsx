import Image from "next/image";

function Empty() {
  return (
    <div className="border-l border-conversation-border w-full bg-panel-header-background flex flex-col h-screen border-b-4 border-b-icon-ack items-center justify-center">
      <Image src='/wavelink.gif' alt='wavelink' width={300} height={300} />
    </div>
  );
}

export default Empty;
