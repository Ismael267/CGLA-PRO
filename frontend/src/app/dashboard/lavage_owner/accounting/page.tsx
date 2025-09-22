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
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  X,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  FileText,
  Receipt,
  BarChart3,
  Wallet,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: "income" | "expense"
  paymentMethod: string
  status: "completed" | "pending" | "cancelled"
}

export default function AccountingManagementDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "cancelled">("all")
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "",
    amount: 0,
    type: "income",
    paymentMethod: "cash",
    status: "completed",
  })

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-03-25",
      description: "Lavage Premium - Voiture BMW",
      category: "Services de lavage",
      amount: 45,
      type: "income",
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "2",
      date: "2024-03-25",
      description: "Achat produits nettoyage",
      category: "Fournitures",
      amount: 320,
      type: "expense",
      paymentMethod: "transfer",
      status: "completed",
    },
    {
      id: "3",
      date: "2024-03-24",
      description: "Abonnement Mensuel - M. Martin",
      category: "Abonnements",
      amount: 120,
      type: "income",
      paymentMethod: "transfer",
      status: "completed",
    },
    {
      id: "4",
      date: "2024-03-24",
      description: "Salaires employés",
      category: "Personnel",
      amount: 2850,
      type: "expense",
      paymentMethod: "transfer",
      status: "pending",
    },
    {
      id: "5",
      date: "2024-03-23",
      description: "Lavage Intérieur - Voiture Audi",
      category: "Services de lavage",
      amount: 75,
      type: "income",
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "6",
      date: "2024-03-23",
      description: "Facture électricité",
      category: "Services publics",
      amount: 420,
      type: "expense",
      paymentMethod: "transfer",
      status: "completed",
    },
    {
      id: "7",
      date: "2024-03-22",
      description: "Rénovation équipement",
      category: "Équipement",
      amount: 1250,
      type: "expense",
      paymentMethod: "transfer",
      status: "completed",
    },
    {
      id: "8",
      date: "2024-03-22",
      description: "Forfait Entreprise - AutoLuxe",
      category: "Contrats entreprises",
      amount: 850,
      type: "income",
      paymentMethod: "transfer",
      status: "completed",
    },
  ])

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.category && newTransaction.amount > 0) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        date: newTransaction.date,
        description: newTransaction.description,
        category: newTransaction.category,
        amount: newTransaction.amount,
        type: newTransaction.type as "income" | "expense",
        paymentMethod: newTransaction.paymentMethod,
        status: newTransaction.status as "completed" | "pending" | "cancelled",
      }
      setTransactions([...transactions, transaction])
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: "",
        category: "",
        amount: 0,
        type: "income",
        paymentMethod: "cash",
        status: "completed",
      })
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== transactionId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Complété</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">En attente</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Annulé</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "transfer":
        return <Banknote className="h-4 w-4 text-green-500" />
      case "cash":
        return <Wallet className="h-4 w-4 text-amber-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
      const matchesType = typeFilter === "all" || transaction.type === typeFilter
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesType && matchesStatus
    })
  }, [transactions, searchTerm, categoryFilter, typeFilter, statusFilter])

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === "income" && t.status === "completed")
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === "expense" && (t.status === "completed" || t.status === "pending"))
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    
    const pendingTransactions = transactions.filter(t => t.status === "pending").length
    const netProfit = totalIncome - totalExpenses
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      pendingTransactions,
      profitability: totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0
    }
  }, [transactions])

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map(transaction => transaction.category)))
  }, [transactions])

  const clearSearch = () => setSearchTerm("")

  return (
    <div className="rounded-md min-h-fit bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="rounded-lg border-b border-gray-200 bg-white shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion Comptable</h1>
              <p className="text-sm text-gray-500">Centre de Lavage Auto Premium</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Ajouter une transaction</DialogTitle>
                  <DialogDescription>Enregistrez une nouvelle transaction financière.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date" className="text-slate-700 font-medium">Date <span className="text-red-500">*</span></Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type" className="text-slate-700 font-medium">Type <span className="text-red-500">*</span></Label>
                      <select
                        id="type"
                        value={newTransaction.type}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                      >
                        <option value="income">Recette</option>
                        <option value="expense">Dépense</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-slate-700 font-medium">Description <span className="text-red-500">*</span></Label>
                    <Input
                      id="description"
                      value={newTransaction.description}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      placeholder="Ex: Lavage Premium - Voiture BMW"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="text-slate-700 font-medium">Catégorie <span className="text-red-500">*</span></Label>
                      <Input
                        id="category"
                        value={newTransaction.category}
                        className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        placeholder="Ex: Services de lavage"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount" className="text-slate-700 font-medium">Montant (€) <span className="text-red-500">*</span></Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newTransaction.amount}
                        className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="paymentMethod" className="text-slate-700 font-medium">Méthode de paiement</Label>
                      <select
                        id="paymentMethod"
                        value={newTransaction.paymentMethod}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        onChange={(e) => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
                      >
                        <option value="cash">Espèces</option>
                        <option value="card">Carte bancaire</option>
                        <option value="transfer">Virement</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status" className="text-slate-700 font-medium">Statut</Label>
                      <select
                        id="status"
                        value={newTransaction.status}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
                      >
                        <option value="completed">Complété</option>
                        <option value="pending">En attente</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddTransaction} 
                    className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                    disabled={!newTransaction.description || !newTransaction.category || newTransaction.amount <= 0}
                  >
                    Ajouter la transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 p-4">
              <CardTitle className="text-sm font-medium text-green-800">Recettes Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalIncome.toLocaleString('fr-FR')}€</div>
              <p className="text-xs text-gray-500 mt-1">Ce mois</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50 p-4">
              <CardTitle className="text-sm font-medium text-red-800">Dépenses Totales</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalExpenses.toLocaleString('fr-FR')}€</div>
              <p className="text-xs text-gray-500 mt-1">Ce mois</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4">
              <CardTitle className="text-sm font-medium text-blue-800">Bénéfice Net</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.netProfit.toLocaleString('fr-FR')}€</div>
              <p className="text-xs text-gray-500 mt-1">{stats.profitability}% de marge</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 p-4">
              <CardTitle className="text-sm font-medium text-amber-800">Transactions en attente</CardTitle>
              <FileText className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.pendingTransactions}</div>
              <p className="text-xs text-gray-500 mt-1">À traiter</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="bg-white border border-gray-200 shadow-sm h-fit">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  Journal des Transactions
                </CardTitle>
                <CardDescription className="mt-1">
                  Suivez toutes les transactions financières de votre entreprise
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par description ou catégorie..."
                    className="pl-9 pr-9 w-full border border-gray-300 "
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
                      Type
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuItem 
                      onClick={() => setTypeFilter("all")}
                      className={typeFilter === "all" ? "bg-gray-100" : ""}
                    >
                      Tous
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setTypeFilter("income")}
                      className={typeFilter === "income" ? "bg-gray-100" : ""}
                    >
                      Recettes
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setTypeFilter("expense")}
                      className={typeFilter === "expense" ? "bg-gray-100" : ""}
                    >
                      Dépenses
                    </DropdownMenuItem>
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
                      onClick={() => setStatusFilter("completed")}
                      className={statusFilter === "completed" ? "bg-gray-100" : ""}
                    >
                      Complétés
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("pending")}
                      className={statusFilter === "pending" ? "bg-gray-100" : ""}
                    >
                      En attente
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("cancelled")}
                      className={statusFilter === "cancelled" ? "bg-gray-100" : ""}
                    >
                      Annulés
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
                    <TableHead className="font-semibold text-gray-700 p-3">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Description</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden md:table-cell">Catégorie</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Montant</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden lg:table-cell">Paiement</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        {searchTerm || categoryFilter !== "all" || typeFilter !== "all" || statusFilter !== "all"
                          ? "Aucune transaction ne correspond à vos critères de recherche." 
                          : "Aucune transaction enregistrée."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                        <TableCell className="p-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(transaction.date).toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                        </TableCell>
                        <TableCell className="p-3 hidden md:table-cell">
                          <div className="text-sm text-gray-600">{transaction.category}</div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className={`flex items-center font-semibold ${transaction.type === "income" ? "text-green-700" : "text-red-700"}`}>
                            {transaction.type === "income" ? 
                              <ArrowUpRight className="h-4 w-4 mr-1 text-green-600" /> : 
                              <ArrowDownRight className="h-4 w-4 mr-1 text-red-600" />
                            }
                            {transaction.amount.toLocaleString('fr-FR')}€
                          </div>
                        </TableCell>
                        <TableCell className="p-3 hidden lg:table-cell">
                          <div className="flex items-center text-sm text-gray-600">
                            {getPaymentMethodIcon(transaction.paymentMethod)}
                            <span className="ml-1 capitalize">{transaction.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-3">{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="p-3">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer text-gray-600">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-gray-600">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Générer reçu
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteTransaction(transaction.id)}
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