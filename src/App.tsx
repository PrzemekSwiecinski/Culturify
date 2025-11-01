import React from "react";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import MainPage from "./views/MainPage";
import AddOrganizer from "./views/AddOrganizer";
import AddEvent from "./views/AddEvent";
import LoginViewOrganizer from "./views/LoginViewOrganizer";
import LoginViewAdmin from "./views/LoginViewAdmin";
import AboutUs from "./views/AboutUs";
import TermsAndConditions from "./views/TermsAndConditions";
import Contact from "./views/Contact";
import OrganizerView from "./views/OrganizerView";
import UserView from "./views/UserView";
import UsersTickets from "./views/UsersTickets";
import TicketMarket from "./views/TicketMarket";
import OrganizerEvents from "./views/OrganizerEvents";
import AdminPanel from "./views/AdminPanel";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/rejestracja" element={<RegisterView />} />
        <Route path="/onas" element={<AboutUs />} />
        <Route path="/regulamin" element={<TermsAndConditions />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/dodawanie_organizatora" element={<AddOrganizer />} />
        <Route path="/dodawanie_wydarzen" element={<AddEvent />} />
        <Route path="/bilety_uzytkownika" element={<UsersTickets />} />
        <Route path="/rynek_biletow" element={<TicketMarket />} />
        <Route path="/profil_organizatora" element={<OrganizerView />} />
        <Route path="/profil_uzytkownika" element={<UserView />} />
        <Route path="/login_organizatora" element={<LoginViewOrganizer />} />
        <Route path="/login_admin" element={<LoginViewAdmin />} />
        <Route path="/wydarzenia_organizatora" element={<OrganizerEvents />} />
        <Route path="/panel_admina" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
