import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export const CountUpStats = () => {
    return (
        <div className="bg-gray-200">
            <div className="mx-auto max-w-3xl px-4 py-20 md:py-24 mt-4">
                <h2 className="text-center text-base text-indigo-900 sm:text-lg md:mb-16">
                    Gain Your Users' Confidence by
                    <span className="text-indigo-500"> Showcasing Total Downloads</span>
                </h2>


                <div className="flex flex-col items-center justify-center sm:flex-row">
                    <Stat
                        num={45}
                        suffix="%"
                        subheading="Increase in number of Winners"
                    />
                    <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                    <Stat
                        num={15.5}
                        decimals={1}
                        suffix="K+"
                        subheading="Total Downloads till date"
                    />
                    <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                    <Stat
                        num={20}
                        suffix="B+"
                        subheading="Total Contest conduted on our App"
                    />
                </div>
            </div>
        </div>
    );
};

const Stat = ({ num, suffix, decimals = 0, subheading }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
        if (!isInView) return;

        animate(0, num, {
            duration: 2.5,
            onUpdate(value) {
                if (!ref.current) return;

                ref.current.textContent = value.toFixed(decimals);
            },
        });
    }, [num, decimals, isInView]);

    return (
        <div className="flex w-72 flex-col items-center py-8 sm:py-0">
            <p className=" text-center text-7xl font-semibold sm:text-6xl">
                <span ref={ref}></span>
                {suffix}
            </p>
            <p className="max-w-48 text-center text-neutral-600">{subheading}</p>
        </div>
    );
};