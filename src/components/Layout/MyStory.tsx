import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchStoryContent,
  selectOriginContent,
  selectTimeline,
  selectStoryIsFetching,
  selectStoryError,
} from '../../store/slice/storySlice';

const MyStory = () => {
  const dispatch = useAppDispatch();
  const origin = useAppSelector(selectOriginContent);
  const timeline = useAppSelector(selectTimeline);
  const isLoading = useAppSelector(selectStoryIsFetching);
  const error = useAppSelector(selectStoryError);

  useEffect(() => {
    dispatch(fetchStoryContent());
  }, [dispatch]);

  // Convert newlines to <br /> for the origin title
  const formatTitleWithBreaks = (text: string) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (isLoading && !origin) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#2C1A0E]">
        <p className="text-sm text-[#D4A843]">Loading story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#2C1A0E]">
        <p className="text-sm text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!origin) return null;

  return (
    <>
      {/* ── ORIGIN STORY ── */}
      <section className="relative overflow-hidden bg-[#2C1A0E] px-6 py-24 md:px-[6%] font-sans" id='story'>
        {/* Watermark */}
        <span
          className="absolute -top-20 -left-5 font-serif text-[28rem] font-bold text-white/5 select-none pointer-events-none"
          aria-hidden="true"
        >
          "
        </span>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-24 items-start">
          {/* Left column */}
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#D4A843] mb-5">
              {origin.origin_label}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#F2DBA8]">
              {formatTitleWithBreaks(origin.origin_title)}
              {origin.origin_emphasis && (
                <em className="italic text-[#D4A843] not-italic">
                  {origin.origin_emphasis}
                </em>
              )}
            </h2>
            <p className="text-base leading-relaxed font-light text-[#F2DBA8]/65 mt-6">
              {origin.origin_body}
            </p>
          </div>

          {/* Right column */}
          <div>
            <blockquote className="font-serif text-xl md:text-2xl italic text-[#F2DBA8] leading-relaxed border-l-3 border-[#D4A843] pl-6 mb-8">
              “{origin.origin_quote}”
            </blockquote>
            <p className="text-base leading-relaxed font-light text-[#F2DBA8]/65">
              {origin.origin_detail}
            </p>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-[#2C1A0E] px-6 pb-24 md:px-[6%] font-sans">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#D4A843] text-center pb-12">
          The Journey
        </p>

        <div className="relative max-w-3xl mx-auto">
          {/* Central spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4A843]/20 -translate-x-1/2 hidden md:block" />

          {timeline.map((item, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={item.id}
                className="relative grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] gap-0 mb-12 items-start"
              >
                {/* Content – left side for odd, right side for even */}
                <div
                  className={`
                    md:pr-10 md:text-right
                    ${isEven ? 'md:col-start-3 md:pl-10 md:text-left' : 'md:col-start-1'}
                  `}
                >
                  <div className="font-serif text-3xl font-bold text-[#D4A843] leading-none mb-1">
                    {item.year}
                  </div>
                  <div className="font-serif text-xl font-semibold text-[#F2DBA8] mb-2">
                    {item.heading}
                  </div>
                  <p className="text-sm leading-relaxed font-light text-[#F2DBA8]/65">
                    {item.description}
                  </p>
                  <span className="inline-block mt-2 bg-[#D4A843]/10 border border-[#D4A843]/40 text-[#D4A843] text-[11px] font-medium tracking-wide px-2 py-0.5">
                    {item.tag}
                  </span>
                </div>

                {/* Dot */}
                <div
                  className={`
                    w-12 h-12 md:w-[52px] md:h-[52px] rounded-full border-2 flex items-center justify-center font-serif font-bold text-sm z-10
                    ${item.active && !item.is_now ? 'bg-[#D4A843] text-[#2C1A0E] border-[#D4A843] shadow-[0_0_0_6px_rgba(212,168,67,0.15)]' : ''}
                    ${item.is_now ? 'bg-[#3E6B4E] text-white border-[#3E6B4E] shadow-[0_0_0_6px_rgba(62,107,78,0.2)] text-[11px] tracking-wide' : ''}
                    ${!item.active && !item.is_now ? 'bg-[#2C1A0E] text-[#D4A843] border-[#D4A843]' : ''}
                    justify-self-center md:justify-self-center
                    ${isEven ? 'md:col-start-2' : 'md:col-start-2'}
                    row-start-1 md:row-auto
                    mx-auto md:mx-0
                  `}
                  aria-hidden="true"
                >
                  {item.dot}
                </div>

                {/* Empty spacer – only needed on md+ to keep grid symmetry */}
                <div className="hidden md:block" />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MyStory;