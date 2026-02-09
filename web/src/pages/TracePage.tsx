import React, { useEffect, useState } from 'react';
import TraceVisualizer from '../components/trace/TraceVisualizer';
import { fetchTrace } from '../components/utils/api';
import type { Trace } from '../types/trace';
import { useParams } from 'react-router-dom';

const TracePage: React.FC = () => {
    const [traces, setTraces] = useState<Trace[]>([]);
    const { id } = useParams<{ id: string }>() as { id: string };
    
    useEffect(() => {
        fetchTrace(id).then(setTraces);
    }, []);
    
    return <TraceVisualizer traces={traces} />
}

export default TracePage;