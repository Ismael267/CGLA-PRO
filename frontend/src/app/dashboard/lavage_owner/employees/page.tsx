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
  Users,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  X,
  Clock,
  DollarSign,
  User,
  BadgeCheck,
  BadgeAlert,
  MoreHorizontal,
} from "lucide-react"

interface Employee {
  id: string
  firstName: string
  lastName: string
  position: string
  salary: number
  schedule: string
  phone: string
  email: string
  hireDate: string
  status: "active" | "inactive" | "leave"
  washLocation: string
}

export default function EmployeeManagementDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "leave">("all")
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    position: "",
    salary: 0,
    schedule: "",
    phone: "",
    email: "",
    hireDate: "",
    washLocation: "",
  })

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      firstName: "Jean",
      lastName: "Martin",
      position: "Laveur Principal",
      salary: 2200,
      schedule: "8h-16h",
      phone: "06 12 34 56 78",
      email: "jean.martin@lavage.fr",
      hireDate: "2023-01-15",
      status: "active",
      washLocation: "Lavage Centre-Ville",
    },
    {
      id: "2",
      firstName: "Marie",
      lastName: "Dubois",
      position: "Responsable Équipe",
      salary: 2800,
      schedule: "9h-17h",
      phone: "06 98 76 54 32",
      email: "marie.dubois@lavage.fr",
      hireDate: "2022-06-10",
      status: "active",
      washLocation: "Lavage Nord",
    },
    {
      id: "3",
      firstName: "Pierre",
      lastName: "Leroy",
      position: "Laveur",
      salary: 1900,
      schedule: "14h-22h",
      phone: "06 55 44 33 22",
      email: "pierre.leroy@lavage.fr",
      hireDate: "2023-09-01",
      status: "leave",
      washLocation: "Lavage Sud",
    },
    {
      id: "4",
      firstName: "Sophie",
      lastName: "Bernard",
      position: "Laveur",
      salary: 1950,
      schedule: "10h-18h",
      phone: "06 77 88 99 00",
      email: "sophie.bernard@lavage.fr",
      hireDate: "2024-02-15",
      status: "active",
      washLocation: "Lavage Est",
    },
    {
      id: "5",
      firstName: "Thomas",
      lastName: "Petit",
      position: "Manager",
      salary: 3200,
      schedule: "9h-17h",
      phone: "06 11 22 33 44",
      email: "thomas.petit@lavage.fr",
      hireDate: "2021-11-20",
      status: "inactive",
      washLocation: "Lavage Centre-Ville",
    },
  ])

  const handleAddEmployee = () => {
    if (newEmployee.firstName && newEmployee.lastName && newEmployee.position && newEmployee.email) {
      const employee: Employee = {
        id: Date.now().toString(),
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        position: newEmployee.position,
        salary: newEmployee.salary,
        schedule: newEmployee.schedule,
        phone: newEmployee.phone,
        email: newEmployee.email,
        hireDate: newEmployee.hireDate || new Date().toISOString().split("T")[0],
        status: "active",
        washLocation: newEmployee.washLocation,
      }
      setEmployees([...employees, employee])
      setNewEmployee({
        firstName: "",
        lastName: "",
        position: "",
        salary: 0,
        schedule: "",
        phone: "",
        email: "",
        hireDate: "",
        washLocation: "",
      })
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter((employee) => employee.id !== employeeId))
  }

  const handleToggleStatus = (employeeId: string) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === employeeId
          ? { 
              ...employee, 
              status: employee.status === "active" 
                ? "inactive" 
                : employee.status === "inactive"
                  ? "leave"
                  : "active" as "active" | "inactive" | "leave"
            }
          : employee,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 flex items-center gap-1 w-fit">
          <BadgeCheck className="h-3 w-3" />
          Actif
        </Badge>
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1 w-fit">
          <UserX className="h-3 w-3" />
          Inactif
        </Badge>
      case "leave":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 flex items-center gap-1 w-fit">
          <BadgeAlert className="h-3 w-3" />
          Congé
        </Badge>
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-200">Inconnu</Badge>
    }
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.washLocation.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [employees, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((e) => e.status === "active").length
    const onLeaveEmployees = employees.filter((e) => e.status === "leave").length
    const totalSalaries = employees.reduce((sum, employee) => sum + employee.salary, 0)
    const avgSalary = totalEmployees > 0 ? Math.round(totalSalaries / totalEmployees) : 0
    
    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      totalSalaries,
      avgSalary
    }
  }, [employees])

  const clearSearch = () => setSearchTerm("")

  return (
    <div className="rounded-md min-h-fit bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="rounded-lg border-b border-gray-200 bg-white shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion des Employés</h1>
              <p className="text-sm text-gray-500">Centre de Lavage Auto Premium</p>
            </div>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Ajouter un nouvel employé</DialogTitle>
                <DialogDescription>Enregistrez un nouvel employé dans le système.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">Prénom <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      value={newEmployee.firstName}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                      placeholder="Ex: Jean"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">Nom <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                      placeholder="Ex: Dupont"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="position" className="text-slate-700 font-medium">Poste <span className="text-red-500">*</span></Label>
                    <Input
                      id="position"
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                      placeholder="Ex: Laveur Principal"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary" className="text-slate-700 font-medium">Salaire (€)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newEmployee.salary}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
                      placeholder="2200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="schedule" className="text-slate-700 font-medium">Horaires</Label>
                    <Input
                      id="schedule"
                      value={newEmployee.schedule}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewEmployee({ ...newEmployee, schedule: e.target.value })}
                      placeholder="Ex: 8h-16h"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Téléphone</Label>
                    <Input
                      id="phone"
                      value={newEmployee.phone}
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="jean.dupont@lavage.fr"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hireDate" className="text-slate-700 font-medium">Date d'embauche</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      value={newEmployee.hireDate}
                      onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="washLocation" className="text-slate-700 font-medium">Site de lavage</Label>
                    <Input
                      id="washLocation"
                      className="border-slate-200 hover:border-slate-300 focus:border-blue-600"
                      value={newEmployee.washLocation}
                      onChange={(e) => setNewEmployee({ ...newEmployee, washLocation: e.target.value })}
                      placeholder="Ex: Lavage Centre-Ville"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddEmployee} 
                  className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                  disabled={!newEmployee.firstName || !newEmployee.lastName || !newEmployee.position || !newEmployee.email}
                >
                  Ajouter l'employé
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
              <CardTitle className="text-sm font-medium text-blue-800">Total Employés</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</div>
              <p className="text-xs text-gray-500 mt-1">Tous sites confondus</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 p-4">
              <CardTitle className="text-sm font-medium text-green-800">Employés Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}% de l'effectif
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50 p-4">
              <CardTitle className="text-sm font-medium text-purple-800">Masse Salariale</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalSalaries.toLocaleString()}€</div>
              <p className="text-xs text-gray-500 mt-1">Mensuelle</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 p-4">
              <CardTitle className="text-sm font-medium text-amber-800">Salaire Moyen</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.avgSalary.toLocaleString()}€</div>
              <p className="text-xs text-gray-500 mt-1">Par employé</p>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card className="bg-white border border-gray-200 shadow-sm h-fit">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Liste des Employés
                </CardTitle>
                <CardDescription className="mt-1">
                  Gérez vos employés et leurs informations
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par nom, prénom, poste ou site..."
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
                      onClick={() => setStatusFilter("active")}
                      className={statusFilter === "active" ? "bg-gray-100" : ""}
                    >
                      Actifs
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("inactive")}
                      className={statusFilter === "inactive" ? "bg-gray-100" : ""}
                    >
                      Inactifs
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter("leave")}
                      className={statusFilter === "leave" ? "bg-gray-100" : ""}
                    >
                      Congé
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
                    <TableHead className="font-semibold text-gray-700 p-3">Employé</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Poste</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden md:table-cell">Site</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 hidden md:table-cell">Salaire</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700 p-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        {searchTerm || statusFilter !== "all" 
                          ? "Aucun employé ne correspond à vos critères de recherche." 
                          : "Aucun employé enregistré."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                        <TableCell className="p-3">
                          <div>
                            <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              Embauché le {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="font-medium text-gray-900">{employee.position}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1 md:hidden">
                            <Clock className="h-3 w-3 mr-1" />
                            {employee.schedule}
                          </div>
                        </TableCell>
                        <TableCell className="p-3 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 truncate max-w-[160px]">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{employee.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div className="truncate max-w-[140px]">
                              <div className="text-sm font-medium text-gray-900">{employee.washLocation}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 hidden md:table-cell">
                          <div className="font-semibold text-green-700">{employee.salary.toLocaleString()}€</div>
                          <div className="text-xs text-gray-500">par mois</div>
                        </TableCell>
                        <TableCell className="p-3">{getStatusBadge(employee.status)}</TableCell>
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
                                  <User className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-gray-600">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-gray-600" 
                                  onClick={() => handleToggleStatus(employee.id)}
                                >
                                  {employee.status === "active" ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Désactiver
                                    </>
                                  ) : employee.status === "inactive" ? (
                                    <>
                                      <BadgeAlert className="mr-2 h-4 w-4" />
                                      Mettre en congé
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Activer
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteEmployee(employee.id)}
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