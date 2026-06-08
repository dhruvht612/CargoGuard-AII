# CargoGuard AI — Data Models

All models are defined in `backend/app/models/`. FastAPI uses these as Pydantic schemas for request validation and response serialization.

---

## User

```python
class UserRole(str, Enum):
    operator = "operator"
    manager  = "manager"
    admin    = "admin"

class UserStatus(str, Enum):
    active    = "Active"
    suspended = "Suspended"

class User(BaseModel):
    id:           str          # "U-001"
    name:         str
    email:        EmailStr
    company:      str
    role:         UserRole
    claims_count: int = 0
    joined:       date
    status:       UserStatus = UserStatus.active
```

---

## Claim

```python
class ClaimType(str, Enum):
    non_delivery    = "Non-Delivery"
    damaged         = "Damaged"
    not_as_described= "Not As Described"
    counterfeit     = "Counterfeit / Fraud"

class ClaimStatus(str, Enum):
    draft     = "Draft"
    active    = "Active"
    submitted = "Submitted"
    won       = "Won"
    lost      = "Lost"

class WinBand(str, Enum):
    weak     = "Weak"
    moderate = "Moderate"
    strong   = "Strong"

class Claim(BaseModel):
    id:                   str
    type:                 ClaimType
    amount:               float
    deadline:             date
    status:               ClaimStatus
    win_band:             Optional[WinBand] = None
    win_score:            Optional[int]     = None      # 0-100
    win_factors_for:      list[str]         = []
    win_factors_against:  list[str]         = []
    win_missing:          Optional[str]     = None
    order_ref:            Optional[str]     = None
    notice_text:          Optional[str]     = None      # session-only, never persisted
    operator_id:          str
    created:              datetime
    approved_at:          Optional[datetime] = None
    package_url:          Optional[str]      = None

class ClaimCreate(BaseModel):
    notice_text: str
    order_ref:   Optional[str] = None
    amount:      float
    deadline:    date
```

---

## Evidence

```python
class EvidenceStatus(str, Enum):
    present = "present"
    missing = "missing"
    partial = "partial"

class EvidenceSource(str, Enum):
    zenduit       = "Zenduit"
    xentag        = "xentag"
    manual_upload = "Manual Upload"

class EvidenceItem(BaseModel):
    label:  str
    status: EvidenceStatus
    value:  Optional[str]         = None
    source: EvidenceSource

class EvidenceBucket(BaseModel):
    delivery:  list[EvidenceItem] = []
    condition: list[EvidenceItem] = []
    identity:  list[EvidenceItem] = []

class EvidenceGap(BaseModel):
    label:  str
    impact: Literal["large", "medium", "small"]
    bucket: Literal["delivery", "condition", "identity"]

class EvidenceResponse(BaseModel):
    claim_id:           str
    completeness_score: int           # 0-100
    delivery:           list[EvidenceItem]
    condition:          list[EvidenceItem]
    identity:           list[EvidenceItem]
    gaps_ranked:        list[EvidenceGap]
```

---

## Package

```python
class EvidenceIndexItem(BaseModel):
    n:           int
    label:       str
    description: str

class PackageDraft(BaseModel):
    draft_id:        str
    cover_narrative: str
    evidence_index:  list[EvidenceIndexItem]
    disclaimer:      str

class PackageApproval(BaseModel):
    draft_id: str
    approved: bool   # must be True to proceed

class Package(BaseModel):
    package_id:  str
    claim_id:    str
    pdf_url:     str
    approved_at: datetime
    message:     str
```

---

## Zenduit adapter response shapes

These are the raw shapes returned by `adapters/zenduit.py` before normalization.

```python
class ZenduitTrip(BaseModel):
    vehicle_id:       str
    order_id:         str
    origin_lat:       float
    origin_lng:       float
    dest_lat:         float
    dest_lng:         float
    dest_address:     str
    delivered_at:     Optional[datetime]
    address_match:    bool
    dashcam_clip_url: Optional[str]

class ZenduitSensors(BaseModel):
    vehicle_id:    str
    trip_date:     date
    shock_events:  int
    tilt_events:   int
    temp_min_c:    Optional[float]
    temp_max_c:    Optional[float]
    temp_in_range: Optional[bool]

class ZenduitDriver(BaseModel):
    driver_id:         str
    behavior_score:    int           # 0-100
    hos_compliant:     bool
    speeding_events:   int
    hard_brake_events: int
```

---

## xentag adapter response shapes

```python
class XentagScan(BaseModel):
    scan_id:    str
    location:   str
    scanned_at: datetime
    scanned_by: str

class XentagAuthResponse(BaseModel):
    tag_id:           str
    product_sku:      str
    auth_valid:       bool
    auth_cert_url:    Optional[str]
    tamper_detected:  bool
    scan_history:     list[XentagScan]
```

---

## Audit log entry

```python
class AuditAction(str, Enum):
    claim_created     = "claim_created"
    evidence_pulled   = "evidence_pulled"
    file_uploaded     = "file_uploaded"
    score_run         = "score_run"
    draft_generated   = "draft_generated"
    package_approved  = "package_approved"
    package_downloaded= "package_downloaded"
    user_invited      = "user_invited"
    user_suspended    = "user_suspended"
    api_key_rotated   = "api_key_rotated"
    settings_updated  = "settings_updated"

class AuditEntry(BaseModel):
    id:        str
    timestamp: datetime
    actor:     str       # email or "system"
    action:    AuditAction
    target:    str       # claim_id, user_id, integration_id, etc.
    detail:    str = ""
```
