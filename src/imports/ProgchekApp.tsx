function Delete() {
  return (
    <div className="absolute left-[777px] size-[56px] top-[137px]" data-name="Delete">
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}
type AlertEventProps = {
  className?: string;
  description?: string;
  time?: string;
  title?: string;
};

function AlertEvent({ className, description = "New location designed.", time = "2", title = "Design Element" }: AlertEventProps) {
  return (
    <div className={className || "absolute h-[212px] left-[113px] top-[520px] w-[854px]"} data-name="Alert Event">
      <div className="absolute bg-[#910002] border border-[#bcbcbc] border-solid h-[212px] left-0 rounded-[26px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.45)] top-0 w-[854px]" />
      <div className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] font-['Inter:Regular',sans-serif] font-normal h-[139px] leading-[normal] left-[48px] not-italic text-[0px] text-white top-[37px] w-[259px] whitespace-pre-wrap">
        <p className="mb-0 text-[64px]">{`    Hours `}</p>
        <p className="text-[48px]">Remaining</p>
      </div>
      <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[64px] text-white top-[37px] w-[498px] whitespace-pre-wrap">{title}</p>
      <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[36px] text-white top-[124px] w-[498px] whitespace-pre-wrap">{description}</p>
      <div className="absolute bg-white h-[174px] left-[283px] top-[19px] w-[6px]" />
      <p className="-translate-x-full absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[74px] leading-[normal] left-[84px] not-italic text-[64px] text-right text-white top-[37px] w-[70px] whitespace-pre-wrap">{time}</p>
      <Delete />
    </div>
  );
}

function Delete1() {
  return (
    <div className="absolute left-[777px] size-[56px] top-[137px]" data-name="Delete">
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}

function Delete2() {
  return (
    <div className="absolute left-[777px] size-[56px] top-[137px]" data-name="Delete">
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}

function Delete3() {
  return (
    <div className="absolute left-[777px] size-[56px] top-[137px]" data-name="Delete">
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}

function Delete4() {
  return (
    <div className="absolute left-[777px] size-[56px] top-[137px]" data-name="Delete">
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}

function New() {
  return (
    <div className="absolute left-[931.5px] size-[56px] top-[72px]" data-name="New">
      <div className="absolute bg-[#d9d9d9] h-[56px] left-[20.5px] top-0 w-[15px]" />
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute left-[43px] size-[56px] top-[72px]" data-name="Menu">
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[20.5px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-0 w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
      <div className="absolute flex h-[15px] items-center justify-center left-0 top-[41px] w-[56px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="bg-[#d9d9d9] h-[56px] w-[15px]" />
        </div>
      </div>
    </div>
  );
}

function ProjectCompletionBar() {
  return (
    <div className="absolute h-[104px] left-[113px] top-[213px] w-[854px]" data-name="Project Completion Bar">
      <div className="absolute bg-[#d9d9d9] h-[22px] left-0 top-[82px] w-[854px]" />
      <div className="absolute bg-[#0c4] h-[22px] left-0 top-[82px] w-[493px]" />
      <p className="-translate-x-1/2 absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[67px] leading-[normal] left-[426.5px] not-italic text-[64px] text-center text-white top-0 w-[379px] whitespace-pre-wrap">Current Project</p>
    </div>
  );
}

export default function ProgchekApp() {
  return (
    <div className="relative size-full" data-name="Progchek App">
      <div className="absolute bg-gradient-to-b from-[#212121] h-[1920px] left-0 to-[#1f1f1f] to-[92.788%] top-0 via-[#262626] via-[53.365%] w-[1080px]" />
      <AlertEvent />
      <div className="absolute h-[212px] left-[113px] top-[779px] w-[854px]" data-name="Alert Event">
        <div className="absolute bg-[#914400] border border-[#bcbcbc] border-solid h-[212px] left-0 rounded-[26px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.45)] top-0 w-[854px]" />
        <div className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] font-['Inter:Regular',sans-serif] font-normal h-[139px] leading-[normal] left-[48px] not-italic text-[0px] text-white top-[37px] w-[259px] whitespace-pre-wrap">
          <p className="mb-0 text-[64px]">{`    Hours `}</p>
          <p className="text-[48px]">Remaining</p>
        </div>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[64px] text-white top-[37px] w-[498px] whitespace-pre-wrap">Design Element</p>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[36px] text-white top-[124px] w-[498px] whitespace-pre-wrap">New location designed.</p>
        <div className="absolute bg-white h-[174px] left-[283px] top-[19px] w-[6px]" />
        <p className="-translate-x-full absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[74px] leading-[normal] left-[84px] not-italic text-[64px] text-right text-white top-[37px] w-[70px] whitespace-pre-wrap">6</p>
        <Delete1 />
      </div>
      <div className="absolute h-[212px] left-[113px] top-[1038px] w-[854px]" data-name="Alert Event">
        <div className="absolute bg-[#914400] border border-[#bcbcbc] border-solid h-[212px] left-0 rounded-[26px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.45)] top-0 w-[854px]" />
        <div className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] font-['Inter:Regular',sans-serif] font-normal h-[139px] leading-[normal] left-[48px] not-italic text-[0px] text-white top-[37px] w-[259px] whitespace-pre-wrap">
          <p className="mb-0 text-[64px]">{`    Hours `}</p>
          <p className="text-[48px]">Remaining</p>
        </div>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[64px] text-white top-[37px] w-[498px] whitespace-pre-wrap">Design Element</p>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[36px] text-white top-[124px] w-[498px] whitespace-pre-wrap">New location designed.</p>
        <div className="absolute bg-white h-[174px] left-[283px] top-[19px] w-[6px]" />
        <p className="-translate-x-full absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[74px] leading-[normal] left-[84px] not-italic text-[64px] text-right text-white top-[37px] w-[70px] whitespace-pre-wrap">8</p>
        <Delete2 />
      </div>
      <div className="absolute h-[212px] left-[113px] top-[1297px] w-[854px]" data-name="Alert Event">
        <div className="absolute bg-[#818100] border border-[#bcbcbc] border-solid h-[212px] left-0 rounded-[26px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.45)] top-0 w-[854px]" />
        <div className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] font-['Inter:Regular',sans-serif] font-normal h-[139px] leading-[normal] left-[48px] not-italic text-[0px] text-white top-[37px] w-[259px] whitespace-pre-wrap">
          <p className="mb-0 text-[64px]">{`    Hours `}</p>
          <p className="text-[48px]">Remaining</p>
        </div>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[64px] text-white top-[37px] w-[498px] whitespace-pre-wrap">Design Element</p>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[36px] text-white top-[124px] w-[498px] whitespace-pre-wrap">New location designed.</p>
        <div className="absolute bg-white h-[174px] left-[283px] top-[19px] w-[6px]" />
        <p className="-translate-x-full absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[74px] leading-[normal] left-[84px] not-italic text-[64px] text-right text-white top-[37px] w-[70px] whitespace-pre-wrap">12</p>
        <Delete3 />
      </div>
      <div className="absolute h-[212px] left-[113px] top-[1556px] w-[854px]" data-name="Alert Event">
        <div className="absolute bg-[#008163] border border-[#bcbcbc] border-solid h-[212px] left-0 rounded-[26px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.45)] top-0 w-[854px]" />
        <div className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] font-['Inter:Regular',sans-serif] font-normal h-[139px] leading-[normal] left-[48px] not-italic text-[0px] text-white top-[37px] w-[259px] whitespace-pre-wrap">
          <p className="mb-0 text-[64px]">{`    Hours `}</p>
          <p className="text-[48px]">Remaining</p>
        </div>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[64px] text-white top-[37px] w-[498px] whitespace-pre-wrap">Design Element</p>
        <p className="absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[69px] leading-[normal] left-[329px] not-italic text-[36px] text-white top-[124px] w-[498px] whitespace-pre-wrap">New location designed.</p>
        <div className="absolute bg-white h-[174px] left-[283px] top-[19px] w-[6px]" />
        <p className="-translate-x-full absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[74px] leading-[normal] left-[84px] not-italic text-[64px] text-right text-white top-[37px] w-[70px] whitespace-pre-wrap">45</p>
        <Delete4 />
      </div>
      <div className="absolute bg-[#282828] h-[186px] left-0 top-0 w-[1080px]" />
      <p className="-translate-x-1/2 absolute font-['Bebas_Neue_Pro:Expanded_Regular',sans-serif] h-[85px] leading-[normal] left-[542px] not-italic text-[64px] text-center text-white top-[57px] w-[540px] whitespace-pre-wrap">PROGCHEK</p>
      <New />
      <Menu />
      <ProjectCompletionBar />
    </div>
  );
}