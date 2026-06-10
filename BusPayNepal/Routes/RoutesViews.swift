import MapKit
import SwiftUI

struct RoutesView: View {
    @EnvironmentObject private var routesVM: RoutesViewModel
    @State private var filter = "Nearby"

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    Image(systemName: "line.3.horizontal")
                    Text("Bus Pay Nepal")
                        .font(AppFont.sectionHeading)
                        .foregroundStyle(AppColors.brandGold)
                    Spacer()
                }

                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(AppColors.labelGrey)
                    TextField("Search routes, stops, or numbers...", text: $routesVM.searchText)
                        .font(AppFont.bodyPrimary)
                }
                .padding(.horizontal, 14)
                .frame(height: 48)
                .background(Color(hex: "F1F3F5"), in: RoundedRectangle(cornerRadius: 12))

                HStack(spacing: 10) {
                    filterPill("Nearby")
                    filterPill("All")
                }

                ForEach(routesVM.filteredRoutes) { route in
                    NavigationLink {
                        RouteDetailsView(route: route)
                    } label: {
                        RouteCard(route: route)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(20)
            .padding(.bottom, 96)
        }
        .task { await routesVM.load() }
        .background(AppColors.pageBackground.ignoresSafeArea())
    }

    private func filterPill(_ title: String) -> some View {
        Button { filter = title } label: {
            Text(title)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(filter == title ? AppColors.nearBlack : AppColors.labelGrey)
                .padding(.horizontal, 16)
                .frame(height: 36)
                .background(filter == title ? AppColors.amberCTA : Color.clear, in: Capsule())
                .overlay(Capsule().stroke(filter == title ? Color.clear : AppColors.inputBorder, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}

struct RouteDetailsView: View {
    var route: BusRoute
    @State private var camera = MapCameraPosition.region(MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 27.7172, longitude: 85.3240),
        span: MKCoordinateSpan(latitudeDelta: 0.08, longitudeDelta: 0.08)
    ))

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                Map(position: $camera) {
                    Marker(route.origin, coordinate: CLLocationCoordinate2D(latitude: 27.708, longitude: 85.315))
                    Marker(route.destination, coordinate: CLLocationCoordinate2D(latitude: 27.721, longitude: 85.361))
                }
                .frame(height: 220)
                .clipShape(RoundedRectangle(cornerRadius: 16))

                RouteCard(route: route)

                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "Stops")
                    ForEach(Array(route.stops.enumerated()), id: \.offset) { index, stop in
                        HStack {
                            Text("\(index + 1)")
                                .font(.caption.weight(.bold))
                                .frame(width: 28, height: 28)
                                .background(AppColors.amberCTA.opacity(0.2), in: Circle())
                            Text(stop)
                            Spacer()
                        }
                    }
                }
                .smartCard()
            }
            .padding(20)
        }
        .navigationTitle(route.number)
        .background(AppColors.pageBackground.ignoresSafeArea())
    }
}

#if DEBUG
#Preview("Routes") {
    NavigationStack { RoutesView().environmentObject(RoutesViewModel(routeService: MockRouteService())) }
}
#endif
