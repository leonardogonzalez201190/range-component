

export function RangeErrorsTooltip({ errors }: { errors: string[] }) {
    return (
        <div className="w-full flex items-center justify-center cursor-pointer">
            <div className="relative inline-block group">
                <div className="px-3 py-1.5 text-center text-red-700 rounded-md text-sm flex items-center">
                    <span>⚠️ {errors.length} validation error{errors.length > 1 ? 's' : ''} found</span>
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="hidden group-hover:block absolute z-10 p-2 mt-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="text-red-700 font-medium mb-1">Validation Errors:</div>
                    <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                            <li key={index} className="text-gray-800 whitespace-nowrap">{error}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}