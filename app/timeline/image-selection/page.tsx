// /app/timeline/image-selection/page.js
import { Suspense } from 'react';
import ImageSelectionPage from './image-selection-page';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ImageSelectionPage />
        </Suspense>
    );
}