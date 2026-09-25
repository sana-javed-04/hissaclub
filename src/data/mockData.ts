export type ClaimStatus = "verified" | "pending" | "rejected";

export type Claim = {
  id: string;
  name: string;
  phone: string;
  shares: number;
  amount: number;
  txnId: string;
  date: string;
  status: ClaimStatus;
  screenshotUrl?: string;
  note?: string;
};

export type PoolCategory =
  "Family & Weddings" | "Tours & Trips" | "Mohalla & Charity" | "Roommates";

export type Pool = {
  id: string;
  title: string;
  category: PoolCategory;
  description: string;
  target: number;
  splitType: "equal" | "open";
  shareAmount: number;
  totalShares: number;
  adminPin?: string;
  admin: {
    name: string;
    phone: string;
    wallet: string;
    walletType: string;
    iban: string;
    bank: string;
  };
  createdAt: string;
  claims: Claim[];
};

export const CATEGORIES: PoolCategory[] = [
  "Family & Weddings",
  "Tours & Trips",
  "Mohalla & Charity",
  "Roommates",
];

export const seedPools: Pool[] = [
  {
    id: "murree-2026",
    title: "Murree Group Tour 2026",
    category: "Tours & Trips",
    description:
      "Three nights in Murree for the college crew. Covers the van, hotel rooms and all group meals. Pay your share before 10th Jan so we can confirm the booking.",
    target: 60000,
    splitType: "equal",
    shareAmount: 15000,
    totalShares: 4,
    admin: {
      name: "Bilal Ahmed",
      phone: "923335557788",
      wallet: "03335557788",
      walletType: "JazzCash",
      iban: "PK36SCBL0000001123456702",
      bank: "Meezan Bank",
    },
    createdAt: "2026-01-02",
    claims: [
      {
        id: "c1",
        name: "Bilal Ahmed",
        phone: "923335557788",
        shares: 1,
        amount: 15000,
        txnId: "JC-884213",
        date: "2026-01-02",
        status: "verified",
      },
      {
        id: "c2",
        name: "Hamza Tariq",
        phone: "923451112233",
        shares: 1,
        amount: 15000,
        txnId: "EP-559021",
        date: "2026-01-03",
        status: "verified",
      },
      {
        id: "c3",
        name: "Usman Raza",
        phone: "923001234567",
        shares: 1,
        amount: 15000,
        txnId: "—",
        date: "2026-01-04",
        status: "pending",
      },
      {
        id: "c4",
        name: "Ali Hassan",
        phone: "923219876543",
        shares: 1,
        amount: 15000,
        txnId: "—",
        date: "2026-01-04",
        status: "pending",
      },
    ],
  },
  {
    id: "nikkah-sadia",
    title: "Sadia Baji Nikkah Gift Pool",
    category: "Family & Weddings",
    description:
      "Cousins pooling together for one big gift instead of small separate ones. Open contribution, give whatever feels right.",
    target: 85000,
    splitType: "open",
    shareAmount: 0,
    totalShares: 0,
    admin: {
      name: "Ayesha Khan",
      phone: "923214445566",
      wallet: "03214445566",
      walletType: "EasyPaisa",
      iban: "PK24HABB0000001234567890",
      bank: "HBL",
    },
    createdAt: "2026-01-06",
    claims: [
      {
        id: "n1",
        name: "Ayesha Khan",
        phone: "923214445566",
        shares: 1,
        amount: 20000,
        txnId: "EP-771002",
        date: "2026-01-06",
        status: "verified",
      },
      {
        id: "n2",
        name: "Fatima Noor",
        phone: "923008889900",
        shares: 1,
        amount: 12000,
        txnId: "—",
        date: "2026-01-07",
        status: "pending",
      },
    ],
  },
];
