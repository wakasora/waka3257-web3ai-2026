'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
// Leaflet CSSをコンポーネント内で直接読み込み、Next.jsのチャンクで確実に先に適用させます
import 'leaflet/dist/leaflet.css';
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

    // 津田沼駅中心座標
    const centerLat = 35.6912;
    const centerLng = 140.0210;

    // 半径約3kmの移動制限範囲 (緯度・経度の差約0.027)
    const boundsOffset = 0.027;
    const southWest = L.latLng(centerLat - boundsOffset, centerLng - boundsOffset);
    const northEast = L.latLng(centerLat + boundsOffset, centerLng + boundsOffset);
    const maxBounds = L.latLngBounds(southWest, northEast);

    // 地図の初期化
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 15,
      minZoom: 14, // 外側にズームアウトしすぎない制限
      maxZoom: 18,
      maxBounds: maxBounds,
      maxBoundsViscosity: 1.0, // 範囲外に行こうとすると弾き返される
      zoomControl: false,
    });
    mapRef.current = map;

    // ズームコントロール
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 超シンプルなライトテーマ地図タイル (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // 【重要】レンダリングズレの解消のため、少し遅らせてサイズ更新を実行する
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
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
        fillColor: isSelected ? '#d97706' : '#f59e0b',
        color: '#ffffff',
        weight: 2,
        fillOpacity: isSelected ? 0.95 : 0.75,
      });

      marker.addTo(map);

      // マーカークリック時の動作を定義
      marker.on('click', (e) => {
        // イベントがマップ背景のクリック等に伝播しないようにする
        L.DomEvent.stopPropagation(e);
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
      <div ref={mapContainerRef} className="w-full h-full rounded border border-stone-200 shadow-inner" />
    </div>
  );
}
