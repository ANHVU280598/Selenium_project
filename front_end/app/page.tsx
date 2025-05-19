import Display_Automation from "@/components/Display_Automation";
import Display_SopName from "@/components/Display_SopName";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-screen h-screen ">
      <div className="flex flex-col h-[950px] w-[1080px] bg-gray-100 items-center p-3 space-y-2">
        <span className="font-bold">CREATE SOP</span>
        <div className="h-[200px] bg-purple-200/20 p-2 overflow-auto rounded-2xl border-2 border-purple-200">
          <Display_SopName />
        </div>
        <div className="h-[650px] w-full bg-blue-200/20 p-2 overflow-auto rounded-2xl border-2 border-purple-200">
          <Display_Automation />
        </div>

      </div>
    </div>
  );
}
