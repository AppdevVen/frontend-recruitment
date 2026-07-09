/**
 * Recruitment Routes — Frontend
 */

const recruitmentRoutes = [
  {
    path: "/register",
    name: "candidate-registration",
    component: () => import("./../pages/recruitment/CandidateRegistrationPage.vue"),
    meta: { title: "Pendaftaran Kandidat — Recruitment DBC" }
  },
  {
    path: "/admin",
    component: () => import("./../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "priorities",
        name: "admin-priorities",
        component: () => import("./../pages/recruitment/PriorityListPage.vue"),
        meta: { title: "Master Prioritas — Recruitment DBC" }
      },
      {
        path: "periods",
        name: "admin-periods",
        component: () => import("./../pages/recruitment/PeriodPage.vue"),
        meta: { title: "Master Periode — Recruitment DBC" }
      },
      {
        path: "candidates",
        name: "admin-candidates",
        component: () => import("./../pages/recruitment/CandidateListPage.vue"),
        meta: { title: "Data Pelamar — Recruitment DBC" }
      },
    ]
  }
];

export default recruitmentRoutes;
