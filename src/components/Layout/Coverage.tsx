import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchCoverage,
  selectCoverageMain,
  selectCoverageCounties,
  selectCoverageFetching,
  selectCoverageError,
} from '../../store/slice/coverageSlice';

const Coverage = () => {
  const dispatch = useAppDispatch();
  const main = useAppSelector(selectCoverageMain);
  const counties = useAppSelector(selectCoverageCounties);
  const isLoading = useAppSelector(selectCoverageFetching);
  const error = useAppSelector(selectCoverageError);

  useEffect(() => {
    dispatch(fetchCoverage());
  }, [dispatch]);

  if (isLoading && !main) {
    return (
      <section className="bg-[#F2DBA8] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto text-center text-[#3E6B4E]">Loading coverage...</div>
      </section>
    );
  }

  if (error || !main) {
    return (
      <section className="bg-[#F2DBA8] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto text-center text-red-600">{error || 'No coverage data'}</div>
      </section>
    );
  }

  return (
    <section id="coverage" aria-label="Coverage" className="bg-[#F2DBA8] py-24 px-6 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
        {/* Left column */}
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#3E6B4E] mb-3">
            Where We Operate
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2C1A0E] leading-tight mb-8">
            Two Counties,<br />One Mission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {counties.map((county) => (
              <div key={county.id} className="bg-[#FFFDF8] p-6 border-b-3 border-[#3E6B4E]">
                <div className="font-serif text-2xl font-bold text-[#2C1A0E]">{county.county_name}</div>
                <div className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-[#3E6B4E] my-1">
                  County
                </div>
                <ul className="list-none p-0 m-0">
                  {county.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-1 text-[0.85rem] font-light text-[#7A4A2E] leading-relaxed">
                      <span className="text-[#3E6B4E]">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div>
          <blockquote className="font-serif text-2xl md:text-3xl italic font-semibold text-[#2C1A0E] leading-relaxed mb-5">
            {main.quote}
          </blockquote>
          <p className="text-[0.92rem] leading-relaxed font-light text-[#7A4A2E] mb-10">
            {main.body}
          </p>
          <div className="flex flex-wrap gap-8 pt-6 border-t border-[#7A4A2E]/20">
            {main.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl font-bold text-[#3E6B4E] leading-none">{stat.num}</div>
                <div className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-[#7A4A2E] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coverage;