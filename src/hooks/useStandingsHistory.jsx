import { useEffect, useState } from 'react';

const SNAPSHOTS_API = `${process.env.REACT_APP_BASE_URL}/v1/snapshots`;

const initialState = { loading: true, dates: [], series: [], error: null };

const useStandingsHistory = (season) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!season) {
      setState({ loading: false, dates: [], series: [], error: null });
      return undefined;
    }

    let isMounted = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const url = `${SNAPSHOTS_API}/timeseries?season=${encodeURIComponent(season)}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`History fetch failed (${res.status}): ${text || res.statusText}`);
        }
        return res.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setState({
          loading: false,
          dates: Array.isArray(payload?.dates) ? payload.dates : [],
          series: Array.isArray(payload?.series) ? payload.series : [],
          error: null,
        });
      })
      .catch((error) => {
        if (!isMounted) return;
        setState({ loading: false, dates: [], series: [], error });
      });

    return () => {
      isMounted = false;
    };
  }, [season]);

  return state;
};

export default useStandingsHistory;
