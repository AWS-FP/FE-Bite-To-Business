// Intentionally blank: no Google Maps, Vietmap, route illustration, ETA service or map logic.
export default function DeliveryMapPlaceholder() {
    return <section className="dl-panel dl-map-panel" aria-label="Vùng bản đồ để trống">
        <div className="dl-panel-heading"><div><h2>Bản đồ tuyến giao hàng</h2><p>Vị trí dành cho bản đồ khi tích hợp sau này</p></div><span className="dl-panel-tag">Map placeholder</span></div>
        <div className="dl-map-empty" aria-label="Bản đồ chưa được tích hợp" />
        <p className="dl-map-note">Bản đồ hiện để trống theo thiết kế. Chưa có dữ liệu bản đồ hoặc định tuyến thực tế.</p>
    </section>;
}
