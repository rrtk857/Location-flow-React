import React, { Component } from "react";
import ReactDOM from "react-dom";
import LocationPicker from "../lib";

/* Default position */
const defaultPosition = {
  lat: 28.6143,
  lng: 77.1994,
};

class LocationPickerExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address:
        "Rashtrapati Bhawan, President's Estate, New Delhi, Delhi 110004",
      position: defaultPosition,
      showSearchForm: false,
      manualAddress: "",
      showAddressForm: false,
      detailedAddress: {
        houseNo: "",
        area: "",
        category: "Home",
      },
      savedAddresses: [],
      searchQuery: "",
      recentSearches: [],
    };

    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.detectLocation = this.detectLocation.bind(this);
    this.toggleSearchForm = this.toggleSearchForm.bind(this);
    this.toggleAddressForm = this.toggleAddressForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDetailedAddressChange =
      this.handleDetailedAddressChange.bind(this);
    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.saveAddress = this.saveAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.addRecentSearch = this.addRecentSearch.bind(this);
    this.updateMapPosition = this.updateMapPosition.bind(this);
  }

  handleLocationChange({ position, address }) {
    this.setState({ position, address });
  }

  detectLocation() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                this.setState({
                  position: {
                    lat: latitude,
                    lng: longitude,
                  },
                  address: results[0].formatted_address,
                });
                this.addRecentSearch(results[0].formatted_address);
              } else {
                alert("Failed to fetch address: " + status);
              }
            }
          );
        },
        (error) => {
          alert(
            "Error detecting location: " +
              (error.message || "Location permission denied.")
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  toggleSearchForm() {
    this.setState((prevState) => ({
      showSearchForm: !prevState.showSearchForm,
    }));
  }

  toggleAddressForm() {
    this.setState((prevState) => ({
      showAddressForm: !prevState.showAddressForm,
    }));
  }

  handleInputChange(event) {
    this.setState({ manualAddress: event.target.value });
  }

  handleDetailedAddressChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      detailedAddress: Object.assign({}, prevState.detailedAddress, {
        [name]: value,
      }),
    }));
  }

  handleCategorySelection(category) {
    this.setState((prevState) => ({
      detailedAddress: Object.assign({}, prevState.detailedAddress, {
        category,
      }),
    }));
  }

  saveAddress() {
    const { detailedAddress, address, savedAddresses } = this.state;

    const newAddress = Object.assign({}, detailedAddress, {
      fullAddress: address,
    });

    this.setState({
      savedAddresses: [...savedAddresses, newAddress],
      showAddressForm: false,
      detailedAddress: { houseNo: "", area: "", category: "Home" },
    });
  }

  deleteAddress(index) {
    this.setState((prevState) => ({
      savedAddresses: prevState.savedAddresses.filter((_, i) => i !== index),
    }));
  }

  handleSearch(event) {
    const { manualAddress } = this.state;

    if (manualAddress) {
      this.addRecentSearch(manualAddress);
    }

    this.setState({ searchQuery: event.target.value });
  }

  addRecentSearch(address) {
    this.setState((prevState) => {
      const recentSearches = [...prevState.recentSearches];
      if (!recentSearches.includes(address)) {
        recentSearches.unshift(address);
        if (recentSearches.length > 5) {
          recentSearches.pop();
        }
      }
      return { recentSearches };
    });
  }

  updateMapPosition() {
    const geocoder = new window.google.maps.Geocoder();
    const address = this.state.manualAddress;

    if (!address.trim()) {
      alert("Please enter an address.");
      return;
    }

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        this.setState({
          position: {
            lat: location.lat(),
            lng: location.lng(),
          },
          address: results[0].formatted_address,
          showSearchForm: false,
        });
      } else {
        alert("Failed to fetch location: " + status);
      }
    });
  }

  render() {
    const {
      address,
      showSearchForm,
      showAddressForm,
      detailedAddress,
      savedAddresses,
      searchQuery,
      recentSearches,
    } = this.state;

    const filteredAddresses = savedAddresses.filter((addr) =>
      addr.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const styles = {
      container: {
        fontFamily: "Arial, sans-serif",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "600px",
        backgroundColor: "#f9f9f9",
      },
      header: {
        textAlign: "center",
        color: "#333",
      },
      button: {
        margin: "5px",
        padding: "10px 23px",
        backgroundColor: "#F9629F",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      },
      form: {
        marginTop: "15px",
      },
      input: {
        padding: "10px",
        width: "calc(100% - 22px)",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      },
      mapContainer: {
        marginTop: "20px",
        borderRadius: "8px",
        overflow: "hidden",
      },
      sectionHeader: {
        color: "#555",
        margin: "15px 0",
      },
      list: {
        listStyle: "none",
        padding: 0,
      },
      listItem: {
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        backgroundColor: "#fff",
      },
      listItemButton: {
        backgroundColor: "red",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
      },
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.header}>{address}</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={styles.button} onClick={this.detectLocation}>
            Locate Me
          </button>
          <button style={styles.button} onClick={this.toggleSearchForm}>
            Search Manually
          </button>
          <button style={styles.button} onClick={this.toggleAddressForm}>
            Detailed Address Form
          </button>
        </div>

        {showSearchForm && (
          <form style={styles.form}>
            <input
              type="text"
              value={this.state.manualAddress}
              onChange={this.handleInputChange}
              placeholder="Enter address"
              style={styles.input}
            />
            <button
              type="button"
              style={styles.button}
              onClick={() => {
                this.updateMapPosition();
                this.addRecentSearch(this.state.manualAddress);
              }}
            >
              Search
            </button>
          </form>
        )}

        {showAddressForm && (
          <form style={styles.form}>
            <input
              type="text"
              name="houseNo"
              value={detailedAddress.houseNo}
              onChange={this.handleDetailedAddressChange}
              placeholder="House/Flat/Block No."
              style={styles.input}
            />
            <input
              type="text"
              name="area"
              value={detailedAddress.area}
              onChange={this.handleDetailedAddressChange}
              placeholder="Apartment/Road/Area"
              style={styles.input}
            />
            <div>
              <button
                type="button"
                style={Object.assign({}, styles.button, {
                  backgroundColor: "#28a745",
                })}
                onClick={() => this.handleCategorySelection("Home")}
              >
                🏠 Home
              </button>
              <button
                type="button"
                style={Object.assign({}, styles.button, {
                  backgroundColor: "#ffc107",
                })}
                onClick={() => this.handleCategorySelection("Office")}
              >
                🏢 Office
              </button>
              <button
                type="button"
                style={Object.assign({}, styles.button, {
                  backgroundColor: "#17a2b8",
                })}
                onClick={() => this.handleCategorySelection("Friends & Family")}
              >
                👨‍👩‍👧 Friends & Family
              </button>
            </div>
            <button
              type="button"
              style={Object.assign({}, styles.button, {
                backgroundColor: "#6c757d",
              })}
              onClick={this.saveAddress}
            >
              Save Address
            </button>
          </form>
        )}

        <div style={styles.mapContainer}>
          <LocationPicker
            containerElement={<div style={{ height: "100%" }} />}
            mapElement={<div style={{ height: "400px" }} />}
            defaultPosition={this.state.position}
            radius={-1}
            onChange={this.handleLocationChange}
          />
        </div>

        <div>
          <h2 style={styles.sectionHeader}>Saved Addresses</h2>
          <input
            type="text"
            placeholder="Search saved addresses"
            value={searchQuery}
            onChange={this.handleSearch}
            style={styles.input}
          />
          <ul style={styles.list}>
            {filteredAddresses.map((addr, index) => (
              <li key={index} style={styles.listItem}>
                <p>
                  {addr.category}: {addr.fullAddress}
                </p>
                <p>
                  Details: {addr.houseNo}, {addr.area}
                </p>
                <button
                  style={styles.listItemButton}
                  onClick={() => this.deleteAddress(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={styles.sectionHeader}>Recent Searches</h2>
          <ul style={styles.list}>
            {recentSearches.map((search, index) => (
              <li key={index} style={styles.listItem}>
                {search}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<LocationPickerExample />, document.getElementById("root"));
