"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Package,
  ShoppingCart,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  X,
  Edit,
  Trash2,
  MoreHorizontal,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Warehouse,
  PackageOpen,
  PackageCheck,
} from "lucide-react"

interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  minThreshold: number
  supplier: string
  unit: string
  unitPrice: number
  lastRestock: string
  status: "adequate" | "low" | "critical"
}

export default function StockManagementDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "adequate" | "low" | "critical">("all")
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    minThreshold: 5,
    supplier: "",
    unit: "pièce",
    unitPrice: 0,
  })

  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Shampoing Lavage",
      category: "Produits Lavage",
      quantity: 42,
      minThreshold: 10,
      supplier: "CleanPro",
      unit: "L",
      unitPrice: 15.5,
      lastRestock: "2024-03-15",
      status: "adequate",
    },
    {
      id: "2",
      name: "Cire Protectrice",
      category: "Produits Finition",
      quantity: 8,
      minThreshold: 5,
      supplier: "AutoShine",
      unit: "L",
      unitPrice: 22.9,
      lastRestock: "2024-03-20",
      status: "low",
    },
    {
      id: "3",
      name: "Chiffons Microfibre",
      category: "Consommables",
      quantity: 120,
      minThreshold: 50,
      supplier: "TextilePro",
      unit: "pièce",
      unitPrice: 2.5,
      lastRestock: "2024-03-10",
      status: "adequate",
    },
    {
      id: "4",
      name: "Nettoyant Jantes",
      category: "Produits Spécialisés",
      quantity: 3,
      minThreshold: 5,
      supplier: "WheelClean",
      unit: "L",
      unitPrice: 18.75,
      lastRestock: "2024-02-28",
      status: "critical",
    },
    {
      id: "5",
      name: "Aspirateur Sacs",
      category: "Consommables",
      quantity: 25,
      minThreshold: 20,
      supplier: "CleanPro",
      unit: "pièce",
      unitPrice: 3.2,
      lastRestock: "2024-03-18",
      status: "adequate",
    },
    {
      id: "6",
      name: "Polish Rénovation",
      category: "Produits Finition",
      quantity: 6,
      minThreshold: 5,
      supplier: "AutoShine",
      unit: "L",
      unitPrice: 28.5,
      lastRestock: "2024-03-05",
      status: "low",
    },
    {
      id: "7",
      name: "Gants Jetables",
      category: "Équipement",
      quantity: 200,
      minThreshold: 100,
      supplier: "SafetyGear",
      unit: "paire",
      unitPrice: 0.75,
      lastRestock: "2024-03-22",
      status: "adequate",
    },
  ])

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.supplier) {
      // Determine status based on quantity and threshold
      let status: "adequate" | "low" | "critical" = "adequate";
      if (newItem.quantity <= 0) {
        status = "critical";
      } else if (newItem.quantity < newItem.minThreshold) {
        status = "low";
      } else if (newItem.quantity < newItem.minThreshold * 1.5) {
        status = "low";
      } else {
        status = "adequate";
      }
      
      const item: StockItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        minThreshold: newItem.minThreshold,
        supplier: newItem.supplier,
        unit: newItem.unit,
        unitPrice: newItem.unitPrice,
        lastRestock: new Date().toISOString().split("T")[0],
        status: status,
      }
      setStockItems([...stockItems, item])
      setNewItem({
        name: "",
        category: "",
        quantity: 0,
        minThreshold: 5,
        supplier: "",
        unit: "pièce",
        unitPrice: 0,
      })
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteItem = (itemId: string) => {
    setStockItems(stockItems.filter((item) => item.id !== itemId))
  }

  const handleRestockItem = (itemId: string, quantity: number) => {
    setStockItems(
      stockItems.map((item) =>
        item.id === itemId
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              lastRestock: new Date().toISOString().split("T")[0],
              status: item.quantity + quantity > item.minThreshold * 1.5 ? "adequate" : 
                     item.quantity + quantity > item.minThreshold ? "low" : "critical"
            }
          : item,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "adequate":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Stock OK</Badge>
      case "low":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Stock Bas</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Stock Critique</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [stockItems, searchTerm, categoryFilter, statusFilter])

  const stats = useMemo(() => {
    const totalItems = stockItems.length
    const adequateItems = stockItems.filter((i) => i.status === "adequate").length
    const lowItems = stockItems.filter((i) => i.status === "low").length
    const criticalItems = stockItems.filter((i) => i.status === "critical").length
    const totalValue = stockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    
    return {
      totalItems,
      adequateItems,
      lowItems,
      criticalItems,
      totalValue,
      adequateRate: Math.round((adequateItems / totalItems) * 100)
    }
  }, [stockItems])

  const categories = useMemo(() => {
    return Array.from(new Set(stockItems.map(item => item.category)))
  }, [stockItems])

  const clearSearch = () => setSearchTerm("")

  return (
    <div className="rounded-md min-h-fit bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="rounded-lg border-b border-gray-200 bg-white shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion du Stock</h1>
              <p className="text-sm text-gray-500">Centre de Lavage Auto Premium</p>
            </div>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Ajouter un nouveau produit</DialogTitle>
                <DialogDescription>Enregistrez un nouveau produit dans votre inventaire.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Nom du produit <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Ex: Shampoing Lavage"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-slate-700 font-medium">Catégorie <span className="text-red-500">*</span></Label>
                    <Input
                      id="category"
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      placeholder="Ex: Produits Lavage"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity" className="text-slate-700 font-medium">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minThreshold" className="text-slate-700 font-medium">Seuil d'alerte</Label>
                    <Input
                      id="minThreshold"
                      type="number"
                      value={newItem.minThreshold}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })}
                      placeholder="5"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit" className="text-slate-700 font-medium">Unité</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="Ex: L, pièce, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier" className="text-slate-700 font-medium">Fournisseur <span className="text-red-500">*</span></Label>
                    <Input
                      id="supplier"
                      value={newItem.supplier}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                      placeholder="Ex: CleanPro"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unitPrice" className="text-slate-700 font-medium">Prix unitaire (€)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      value={newItem.unitPrice}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddItem} 
                  className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                  disabled={!newItem.name || !newItem.category || !newItem.supplier}
                >
                  Ajouter le produit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4">
              <CardTitle className="text-sm font-medium text-blue-800">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
              <p className="text-xs text-gray-500 mt-1">En stock</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 p-4">
              <CardTitle className="text-sm font-medium text-green-800">Stock Adéquat</CardTitle>
              <PackageCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.adequateItems}</div>
              <p className="text-xs text-gray-500 mt-1">{stats.adequateRate}% du stock</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 p-4">
              <CardTitle className="text-sm font-medium text-amber-800">Stock Bas</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.lowItems}</div>
              <p className="text-xs text-gray-500 mt-1">Nécessite attention</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50 p-4">
              <CardTitle className="text-sm font-medium text-red-800">Valeur Totale</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalValue.toLocaleString('fr-FR')}€</div>
              <p className="text-xs text-gray-500 mt-1">Valeur du stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock List */}
        <Card className="bg-white border border-gray-200 shadow-sm h-fit">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  Inventaire des Produits
                </CardTitle>
                <CardDescription className="mt-1">
                  Gérez votre stock et recevez des alertes pour les produits à réapprovisionner
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par nom, catégorie ou fournisseur..."
                    className="pl-9 pr-9 w-full border border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1 w-full sm:w-auto">
                      <Filter className="h-4 w-4" />
                      Catégorie
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem 
                      onClick={() => setCategoryFilter("all")}
                      className={categoryFilter === "all" ? "bg-gray-100" : ""}
                    >
                      Toutes les catégories
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={categoryFilter === category ? "bg-gray-100" : ""}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1 w-full sm:w-auto">
                      <Filter className="h-4 w-4" />
                      Statut
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("all")}
                      className={statusFilter === "all" ? "bg-gray-100" : ""}
                    >
                      Tous
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("adequate")}
                      className={statusFilter === "adequate" ? "bg-gray-100" : ""}
                    >
                      Adéquat
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("low")}
                      className={statusFilter === "low" ? "bg-gray-100" : ""}
                    >
                      Bas
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("critical")}
                      className={statusFilter === "critical" ? "bg-gray-100" : ""}
                    >
                      Critique
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 p-3">Produit</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Catégorie</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden md:table-cell">Fournisseur</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden lg:table-cell">Prix Unitaire</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                          ? "Aucun produit ne correspond à vos critères de recherche." 
                          : "Aucun produit en stock."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                        <TableCell className="p-3">
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <PackageOpen className="h-3 w-3 mr-1" />
                              Dernier réappro: {new Date(item.lastRestock).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="font-medium text-gray-900">{item.category}</div>
                        </TableCell>
                        <TableCell className="p-3 hidden md:table-cell">
                          <div className="text-sm text-gray-600">{item.supplier}</div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-900">{item.quantity} {item.unit}</div>
                            <div className="text-xs text-gray-500">seuil: {item.minThreshold}</div>
                          </div>
                          {item.status !== "adequate" && (
                            <div className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {item.status === "critical" ? "Réappro urgent nécessaire" : "Réapprovisionnement recommandé"}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="p-3 hidden lg:table-cell">
                          <div className="font-semibold text-gray-900">{item.unitPrice.toLocaleString('fr-FR')}€</div>
                          <div className="text-xs text-gray-500">par {item.unit}</div>
                        </TableCell>
                        <TableCell className="p-3">{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="p-3">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer text-gray-600">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-gray-600" 
                                  onClick={() => handleRestockItem(item.id, 10)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Réapprovisionner (+10)
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-gray-600" 
                                  onClick={() => handleRestockItem(item.id, 25)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Réapprovisionner (+25)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}