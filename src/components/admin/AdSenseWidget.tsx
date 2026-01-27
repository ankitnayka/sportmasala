'use client';

import { DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

export default function AdSenseWidget() {
    return (
        <div className="bg-white rounded shadow p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-700">AdSense Earnings</h2>
                    <p className="text-sm text-gray-500">Estimated revenue (Last 30 days)</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                </div>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">$1,240.50</span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +12.5%
                </span>
            </div>

            {/* Mock Chart Bar */}
            <div className="flex items-end gap-2 h-24 mb-4">
                {[40, 60, 45, 70, 50, 80, 65, 90, 75, 55, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t transition-all relative group h-full">
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t opacity-80 group-hover:opacity-100"
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-xs text-gray-400">
                <span>01 Jan</span>
                <span>15 Jan</span>
                <span>30 Jan</span>
            </div>
        </div>
    );
}
