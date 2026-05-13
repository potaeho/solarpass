#!/usr/bin/env python3
"""
OpenStreetMap Overpass API에서 한국 고압 송전선(345kV, 765kV)을 가져와
TypeScript 상수 파일로 변환하는 스크립트.
"""

import json
import urllib.request
import urllib.parse
import time
import sys

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

QUERY = """[out:json][timeout:90];
way["power"="line"]["voltage"~"345000|765000"](33.1,124.6,38.6,130.0);
out geom;"""

# 위도/경도 범위로 province 판정
PROVINCE_BOUNDS = [
    ("서울특별시",   37.42, 37.71, 126.76, 127.18),
    ("경기도",       36.95, 38.30, 126.40, 127.90),
    ("인천광역시",   37.22, 37.67, 126.38, 126.84),
    ("강원도",       37.00, 38.62, 127.05, 129.40),
    ("충청북도",     36.20, 37.30, 127.35, 128.60),
    ("충청남도",     35.90, 37.20, 126.10, 127.60),
    ("대전광역시",   36.19, 36.53, 127.24, 127.60),
    ("세종특별자치시", 36.38, 36.64, 127.15, 127.40),
    ("전라북도",     35.30, 36.30, 126.35, 127.90),
    ("전라남도",     33.90, 35.40, 125.70, 127.70),
    ("광주광역시",   35.03, 35.26, 126.72, 127.00),
    ("경상북도",     35.60, 37.15, 127.95, 129.60),
    ("경상남도",     34.50, 35.75, 127.55, 129.45),
    ("대구광역시",   35.69, 36.01, 128.37, 128.78),
    ("울산광역시",   35.36, 35.71, 129.01, 129.43),
    ("부산광역시",   35.01, 35.41, 128.74, 129.37),
    ("제주특별자치도", 33.10, 33.60, 126.10, 126.95),
]

def get_province(lat, lon):
    for name, lat_min, lat_max, lon_min, lon_max in PROVINCE_BOUNDS:
        if lat_min <= lat <= lat_max and lon_min <= lon <= lon_max:
            return name
    # 중심점이 범위 밖이면 가장 가까운 province 반환
    center_lat = (lat_min + lat_max) / 2 if False else lat
    best = "기타"
    best_dist = float('inf')
    for name, lat_min, lat_max, lon_min, lon_max in PROVINCE_BOUNDS:
        c_lat = (lat_min + lat_max) / 2
        c_lon = (lon_min + lon_max) / 2
        dist = (lat - c_lat)**2 + (lon - c_lon)**2
        if dist < best_dist:
            best_dist = dist
            best = name
    return best

def fetch_overpass(query):
    print("Overpass API 요청 중...", flush=True)
    data = urllib.parse.urlencode({"data": query}).encode()
    req = urllib.request.Request(OVERPASS_URL, data=data,
                                  headers={"User-Agent": "SolarMapApp/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"요청 실패: {e}", file=sys.stderr)
        return None

def coords_to_segments(geometry, gap_km=5.0):
    """
    좌표 배열을 gap_km 이상 떨어진 구간에서 잘라 세그먼트 목록으로 반환.
    지나치게 긴 선 → 50개 좌표 단위로 추가 분할.
    """
    if not geometry:
        return []
    segments = []
    current = [geometry[0]]
    for pt in geometry[1:]:
        prev = current[-1]
        dlat = pt["lat"] - prev["lat"]
        dlon = pt["lon"] - prev["lon"]
        dist_approx = ((dlat * 111)**2 + (dlon * 88)**2) ** 0.5
        if dist_approx > gap_km:
            if len(current) >= 2:
                segments.append(current)
            current = [pt]
        else:
            current.append(pt)
    if len(current) >= 2:
        segments.append(current)
    # 50좌표 초과 시 추가 분할
    result = []
    for seg in segments:
        for i in range(0, len(seg), 50):
            chunk = seg[i:i+50]
            if len(chunk) >= 2:
                result.append(chunk)
    return result

def build_ts(ways):
    lines = []
    idx = 1
    for way in ways:
        geom = way.get("geometry", [])
        if not geom:
            continue
        tags = way.get("tags", {})
        voltage_str = tags.get("voltage", "345000")
        voltage = int(voltage_str.split(";")[0].replace(",", "").strip()) if voltage_str else 345000

        # 중심 좌표로 province 판정
        mid = geom[len(geom) // 2]
        province = get_province(mid["lat"], mid["lon"])

        segments = coords_to_segments(geom)
        for seg in segments:
            coords_str = ", ".join(
                f"{{latitude: {p['lat']}, longitude: {p['lon']}}}"
                for p in seg
            )
            id_str = f"o{idx:04d}"
            lines.append(
                f'  {{ id: "{id_str}", province: "{province}", voltage: {voltage}, '
                f'coordinates: [{coords_str}] }},'
            )
            idx += 1
    return lines, idx - 1

def main():
    data = fetch_overpass(QUERY)
    if not data:
        print("데이터를 가져오지 못했습니다.", file=sys.stderr)
        sys.exit(1)

    ways = data.get("elements", [])
    print(f"OSM way {len(ways)}개 수신", flush=True)

    ts_lines, total = build_ts(ways)
    print(f"세그먼트 {total}개 생성", flush=True)

    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "..", "src", "constants", "osmGridLines.ts")
    header = """export type OsmGridLine = {
  id: string;
  province: string;
  voltage: number;
  coordinates: { latitude: number; longitude: number }[];
};

export const OSM_GRID_LINES: OsmGridLine[] = [
"""
    footer = "];\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(ts_lines))
        f.write("\n")
        f.write(footer)

    print(f"저장 완료: {output_path} ({total}개 세그먼트)", flush=True)

if __name__ == "__main__":
    main()
