// /app/timeline/image-selection/page.js
import ImageSelectionContent from '@/features/timeline-selection/image-selection-content';
import { Suspense } from 'react';


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ImageSelectionContent />
        </Suspense>
    );
}