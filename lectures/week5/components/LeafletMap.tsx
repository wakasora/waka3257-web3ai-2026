'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Spot } from '@/lib/types';

interface LeafletMapProps {
  spots: Spot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function LeafletMap({ spots, selectedId, onSelect }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 地図の初期化（津田沼駅周辺）
    const map = L.map(mapContainerRef.current, {
      center: [35.6912, 140.0210],
      zoom: 15,
      zoomControl: false,
    });
    mapRef.current = map;

    // ズームコントロールの位置を右下に
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 超シンプルなライトテーマ地図タイル (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // スポットピンの作成・更新
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 既存のマーカーをクリア
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    spots.forEach((spot) => {
      const isSelected = spot.id === selectedId;

      // 無印風ミニマル円形ピン
      const marker = L.circleMarker([spot.lat, spot.lng], {
        radius: isSelected ? 12 : 8,
        fillColor: isSelected ? '#d97706' : '#f59e0b', // 選択時は少し濃い琥珀色
        color: '#ffffff',
        weight: 2,
        fillOpacity: isSelected ? 0.9 : 0.7,
      });

      marker.addTo(map);

      // クリックイベント
      marker.on('click', () => {
        onSelect(spot.id);
      });

      markersRef.current[spot.id] = marker;
    });
  }, [spots, onSelect, selectedId]);

  // 選択されたピンにフォーカス
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;

    const selectedSpot = spots.find((s) => s.id === selectedId);
    if (selectedSpot) {
      map.panTo([selectedSpot.lat, selectedSpot.lng], { animate: true });
    }
  }, [selectedId, spots]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg border border-stone-200" />
    </div>
  );
}
