import { useState, useEffect } from 'react';
import api from 'api'

const key = 'meconectei_keys'

const useApiKeys = () => {
    const [keys, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = localStorage.getItem(key);

                if (storedData) {
                    setData(JSON.parse(storedData));
                    return;
                }

                const sessionToken = localStorage.getItem("sessionToken");
                const response = await api.get('/keys', {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });

                if (response.status !== 200) {
                    setData({ googleMapsKey: 'not_key' });
                    return
                }
                const { googleMapsKey } = response.data;

                localStorage.setItem(key, JSON.stringify({ googleMapsKey }));

                setData({ googleMapsKey });
            } catch (err) { }
        };

        fetchData();
    }, []);

    return { keys };
};

export default useApiKeys;