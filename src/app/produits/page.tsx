"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Search, ShieldCheck, Filter, PackageSearch, Star, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "SAV AI Pro",
    category: "Logiciels",
    status: "Disponible",
    warranty: "24 mois",
    price: "899 €",
    stock: 32,
    rating: 4.9,
    description: "Plateforme d’assistance intelligente avec workflows automatisés.",
    tags: ["IA", "SaaS", "Monitoring"],
  },
  {
    id: 2,
    name: "Terminal T-200",
    category: "Matériel",
    status: "En stock",
    warranty: "18 mois",
    price: "1 240 €",
    stock: 12,
    rating: 4.7,
    description: "Terminal de support pour gestion des interventions terrain.",
    tags: ["Mobile", "Réseau", "Robuste"],
  },
  {
    id: 3,
    name: "Pack Garantie Premium",
    category: "Services",
    status: "Populaire",
    warranty: "36 mois",
    price: "299 €",
    stock: 64,
    rating: 4.8,
    description: "Service de maintenance avancée avec intervention prioritaire.",
    tags: ["Support", "VIP", "Assurance"],
  },
  {
    id: 4,
    name: "Capteur IA X7",
    category: "IoT",
    status: "Stock faible",
    warranty: "12 mois",
    price: "680 €",
    stock: 4,
    rating: 4.5,
    description: "Capteur intelligent pour diagnostics prédictifs sur équipements.",
    tags: ["IoT", "Prédictif", "Protocole"],
  },
  {
    id: 5,
    name: "Module de sauvegarde SecureVault",
    category: "Logiciels",
    status: "Disponible",
    warranty: "24 mois",
    price: "540 €",
    stock: 20,
    rating: 4.9,
    description: "Sauvegarde centralisée sécurisée et restauration rapide.",
    tags: ["Sécurité", "Cloud", "Backup"],
  },
  {
    id: 6,
    name: "PC Diagnostic Pro",
    category: "Matériel",
    status: "En stock",
    warranty: "24 mois",
    price: "1 880 €",
    stock: 9,
    rating: 4.6,
    description: "Ordinateur de bureau dédié aux diagnostics techniques complexes.",
    tags: ["Diagnostic", "Performance", "Station"],
  },
];

const categories = ["Tout", "Logiciels", "Matériel", "Services", "IoT"] as const;

export default function ProduitsPage() {
  const [productRows, setProductRows] = useState(products);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("Tout");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Logiciels");
  const [newProductPrice, setNewProductPrice] = useState("");

  const filteredProducts = useMemo(() => {
    return productRows.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory = selectedCategory === "Tout" || product.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [productRows, query, selectedCategory]);

  const totalStock = productRows.reduce((sum, product) => sum + product.stock, 0);
  const inWarranty = productRows.filter((product) => product.warranty.includes("24") || product.warranty.includes("36")).length;

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProductName.trim() || !newProductPrice.trim()) return;

    setProductRows((current) => [
      ...current,
      {
        id: Math.max(...current.map((product) => product.id), 0) + 1,
        name: newProductName.trim(),
        category: newProductCategory,
        status: "Disponible",
        warranty: "12 mois",
        price: newProductPrice.trim(),
        stock: 0,
        rating: 0,
        description: "Produit ajouté localement en attendant la connexion à l'API catalogue.",
        tags: ["Nouveau"],
      },
    ]);
    setNewProductName("");
    setNewProductPrice("");
    setIsAddProductOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Catalogue produits & garanties</h1>
        </div>

        <Button type="button" onClick={() => setIsAddProductOpen(true)} className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2">
          <PackageSearch className="h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      {isAddProductOpen && (
        <Card className="border-brand-blue/30 bg-brand-blue/5 shadow-xs" role="dialog" aria-label="Ajouter un produit">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">Ajouter un produit</h2>
                <p className="mt-1 text-sm text-slate-600">Cette référence sera conservée localement pendant la phase de maquette.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddProductOpen(false)}>
                Fermer
              </Button>
            </div>
            <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={handleAddProduct}>
              <input
                value={newProductName}
                onChange={(event) => setNewProductName(event.target.value)}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Nom du produit"
                aria-label="Nom du produit"
                required
              />
              <select
                value={newProductCategory}
                onChange={(event) => setNewProductCategory(event.target.value)}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                aria-label="Catégorie du produit"
              >
                {categories.filter((category) => category !== "Tout").map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  value={newProductPrice}
                  onChange={(event) => setNewProductPrice(event.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Prix (ex. 299 €)"
                  aria-label="Prix du produit"
                  required
                />
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-slate-500">Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{productRows.length}</div>
            <p className="mt-1 text-xs text-slate-500">Références actives</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-slate-500">Stock total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalStock}</div>
            <p className="mt-1 text-xs text-emerald-600">+8% vs. mois précédent</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-slate-500">Garantie premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{inWarranty}</div>
            <p className="mt-1 text-xs text-slate-500">Produits couverts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xs border-slate-200">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un produit, un tag ou une garantie..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-blue focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                Filtre
              </div>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    selectedCategory === category
                      ? "border-brand-blue bg-brand-blue text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border-slate-200 shadow-xs">
            <div className="h-36 bg-gradient-to-br from-brand-blue/15 via-sky-100 to-emerald-100 p-4">
              <div className="flex items-center justify-between">
                <Badge className="border border-white/70 bg-white/80 text-slate-700 hover:bg-white/80">
                  {product.category}
                </Badge>
                <Badge
                  variant={product.status === "Stock faible" ? "secondary" : "outline"}
                  className={[
                    "text-xs",
                    product.status === "Stock faible" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
                  ].join(" ")}
                >
                  {product.status}
                </Badge>
              </div>

              <div className="mt-12 flex items-end justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Produit</div>
                  <div className="text-xl font-bold text-slate-900">{product.name}</div>
                </div>
                <div className="rounded-lg bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {product.stock} en stock
                </div>
              </div>
            </div>

            <CardContent className="space-y-4 p-4">
              <p className="text-sm text-slate-600">{product.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-slate-700">{product.rating}</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{product.price}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Garantie {product.warranty}</span>
                </div>

                <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-blue/80">
                  Détails
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-dashed border-slate-300 bg-slate-50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <PackageSearch className="h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-800">Aucun produit trouvé</h3>
            <p className="mt-1 text-sm text-slate-500">Essayez un autre mot-clé ou modifiez le filtre de catégorie.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}