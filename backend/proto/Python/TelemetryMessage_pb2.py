# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: TelemetryMessage.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import CoreProto_pb2 as CoreProto__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x16TelemetryMessage.proto\x12\x05Proto\x1a\x0f\x43oreProto.proto\"\x84\x06\n\x10TelemetryMessage\x12\x1b\n\x06source\x18\x01 \x01(\x0e\x32\x0b.Proto.Node\x12\x1b\n\x06target\x18\x02 \x01(\x0e\x32\x0b.Proto.Node\x12\x19\n\x03gps\x18\x03 \x01(\x0b\x32\n.Proto.GpsH\x00\x12\x1b\n\x04\x62\x61ro\x18\x04 \x01(\x0b\x32\x0b.Proto.BaroH\x00\x12\x19\n\x03imu\x18\x05 \x01(\x0b\x32\n.Proto.ImuH\x00\x12!\n\x07\x62\x61ttery\x18\x06 \x01(\x0b\x32\x0e.Proto.BatteryH\x00\x12\"\n\nflashState\x18\x07 \x01(\x0b\x32\x0c.Proto.FlashH\x00\x12)\n\x0b\x64mbPressure\x18\x08 \x01(\x0b\x32\x12.Proto.DmbPressureH\x00\x12)\n\x0bpbbPressure\x18\t \x01(\x0b\x32\x12.Proto.PbbPressureH\x00\x12/\n\x0epbbTemperature\x18\n \x01(\x0b\x32\x15.Proto.PbbTemperatureH\x00\x12\x41\n\x17\x63ombustionControlStatus\x18\x0b \x01(\x0b\x32\x1e.Proto.CombustionControlStatusH\x00\x12)\n\x0brcuPressure\x18\x0c \x01(\x0b\x32\x12.Proto.RcuPressureH\x00\x12/\n\x0ercuTemperature\x18\r \x01(\x0b\x32\x15.Proto.RcuTemperatureH\x00\x12)\n\x0bnosLoadCell\x18\x0e \x01(\x0b\x32\x12.Proto.NosLoadCellH\x00\x12)\n\x0brelayStatus\x18\x0f \x01(\x0b\x32\x12.Proto.RelayStatusH\x00\x12+\n\x0cpadBoxStatus\x18\x10 \x01(\x0b\x32\x13.Proto.PadBoxStatusH\x00\x12\x37\n\x12launchRailLoadCell\x18\x11 \x01(\x0b\x32\x19.Proto.LaunchRailLoadCellH\x00\x12/\n\x0esobTemperature\x18\x12 \x01(\x0b\x32\x15.Proto.SobTemperatureH\x00\x42\t\n\x07message\"\xf0\x01\n\x03Gps\x12\'\n\x08latitude\x18\x01 \x01(\x0b\x32\x15.Proto.CoordinateType\x12(\n\tlongitude\x18\x02 \x01(\x0b\x32\x15.Proto.CoordinateType\x12-\n\x10\x61ntenna_altitude\x18\x03 \x01(\x0b\x32\x13.Proto.AltitudeType\x12,\n\x0fgeo_id_altitude\x18\x04 \x01(\x0b\x32\x13.Proto.AltitudeType\x12+\n\x0etotal_altitude\x18\x05 \x01(\x0b\x32\x13.Proto.AltitudeType\x12\x0c\n\x04time\x18\x06 \x01(\r\"2\n\x0e\x43oordinateType\x12\x0f\n\x07\x64\x65grees\x18\x01 \x01(\x05\x12\x0f\n\x07minutes\x18\x02 \x01(\x05\".\n\x0c\x41ltitudeType\x12\x10\n\x08\x61ltitude\x18\x01 \x01(\x05\x12\x0c\n\x04unit\x18\x02 \x01(\x05\"7\n\x04\x42\x61ro\x12\x15\n\rbaro_pressure\x18\x01 \x01(\x05\x12\x18\n\x10\x62\x61ro_temperature\x18\x02 \x01(\x05\"\x95\x01\n\x03Imu\x12\x0f\n\x07\x61\x63\x63\x65l_x\x18\x01 \x01(\x05\x12\x0f\n\x07\x61\x63\x63\x65l_y\x18\x02 \x01(\x05\x12\x0f\n\x07\x61\x63\x63\x65l_z\x18\x03 \x01(\x05\x12\x0e\n\x06gyro_x\x18\x04 \x01(\x05\x12\x0e\n\x06gyro_y\x18\x05 \x01(\x05\x12\x0e\n\x06gyro_z\x18\x06 \x01(\x05\x12\r\n\x05mag_x\x18\x07 \x01(\x05\x12\r\n\x05mag_y\x18\x08 \x01(\x05\x12\r\n\x05mag_z\x18\t \x01(\x05\"\x80\x01\n\x07\x42\x61ttery\x12\x30\n\x0cpower_source\x18\x01 \x01(\x0e\x32\x1a.Proto.Battery.PowerSource\x12\x0f\n\x07voltage\x18\x02 \x01(\x05\"2\n\x0bPowerSource\x12\x0b\n\x07INVALID\x10\x00\x12\n\n\x06GROUND\x10\x01\x12\n\n\x06ROCKET\x10\x02\"5\n\x05\x46lash\x12\x16\n\x0esector_address\x18\x01 \x01(\r\x12\x14\n\x0clogging_rate\x18\x02 \x01(\r\"(\n\x0b\x44mbPressure\x12\x19\n\x11upper_pv_pressure\x18\x01 \x01(\x05\"=\n\x0bPbbPressure\x12\x13\n\x0bib_pressure\x18\x01 \x01(\x05\x12\x19\n\x11lower_pv_pressure\x18\x02 \x01(\x05\"@\n\x0ePbbTemperature\x12\x16\n\x0eib_temperature\x18\x01 \x01(\x05\x12\x16\n\x0epv_temperature\x18\x02 \x01(\x05\"R\n\x17\x43ombustionControlStatus\x12\x11\n\tvent_open\x18\x01 \x01(\x08\x12\x12\n\ndrain_open\x18\x02 \x01(\x08\x12\x10\n\x08mev_open\x18\x03 \x01(\x08\"e\n\x0bRcuPressure\x12\x14\n\x0cpt1_pressure\x18\x01 \x01(\x05\x12\x14\n\x0cpt2_pressure\x18\x02 \x01(\x05\x12\x14\n\x0cpt3_pressure\x18\x03 \x01(\x05\x12\x14\n\x0cpt4_pressure\x18\x04 \x01(\x05\"B\n\x0eRcuTemperature\x12\x17\n\x0ftc1_temperature\x18\x01 \x01(\x05\x12\x17\n\x0ftc2_temperature\x18\x02 \x01(\x05\"3\n\x0bNosLoadCell\x12\x11\n\tnos1_mass\x18\x01 \x01(\x05\x12\x11\n\tnos2_mass\x18\x02 \x01(\x05\"\xde\x01\n\x0bRelayStatus\x12\x10\n\x08\x61\x63\x31_open\x18\x01 \x01(\x08\x12\x10\n\x08\x61\x63\x32_open\x18\x02 \x01(\x08\x12\x11\n\tpbv1_open\x18\x03 \x01(\x08\x12\x11\n\tpbv2_open\x18\x04 \x01(\x08\x12\x11\n\tpbv3_open\x18\x05 \x01(\x08\x12\x11\n\tpbv4_open\x18\x06 \x01(\x08\x12\x11\n\tsol5_open\x18\n \x01(\x08\x12\x11\n\tsol6_open\x18\x0b \x01(\x08\x12\x11\n\tsol7_open\x18\x0c \x01(\x08\x12\x12\n\nsol8a_open\x18\r \x01(\x08\x12\x12\n\nsol8b_open\x18\x0e \x01(\x08\"\\\n\x0cPadBoxStatus\x12\x14\n\x0c\x63ontinuity_1\x18\x01 \x01(\x08\x12\x14\n\x0c\x63ontinuity_2\x18\x02 \x01(\x08\x12\x0f\n\x07\x62ox1_on\x18\x03 \x01(\x08\x12\x0f\n\x07\x62ox2_on\x18\x04 \x01(\x08\")\n\x12LaunchRailLoadCell\x12\x13\n\x0brocket_mass\x18\x01 \x01(\x05\"B\n\x0eSobTemperature\x12\x17\n\x0ftc1_temperature\x18\x01 \x01(\x05\x12\x17\n\x0ftc2_temperature\x18\x02 \x01(\x05\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'TelemetryMessage_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _TELEMETRYMESSAGE._serialized_start=51
  _TELEMETRYMESSAGE._serialized_end=823
  _GPS._serialized_start=826
  _GPS._serialized_end=1066
  _COORDINATETYPE._serialized_start=1068
  _COORDINATETYPE._serialized_end=1118
  _ALTITUDETYPE._serialized_start=1120
  _ALTITUDETYPE._serialized_end=1166
  _BARO._serialized_start=1168
  _BARO._serialized_end=1223
  _IMU._serialized_start=1226
  _IMU._serialized_end=1375
  _BATTERY._serialized_start=1378
  _BATTERY._serialized_end=1506
  _BATTERY_POWERSOURCE._serialized_start=1456
  _BATTERY_POWERSOURCE._serialized_end=1506
  _FLASH._serialized_start=1508
  _FLASH._serialized_end=1561
  _DMBPRESSURE._serialized_start=1563
  _DMBPRESSURE._serialized_end=1603
  _PBBPRESSURE._serialized_start=1605
  _PBBPRESSURE._serialized_end=1666
  _PBBTEMPERATURE._serialized_start=1668
  _PBBTEMPERATURE._serialized_end=1732
  _COMBUSTIONCONTROLSTATUS._serialized_start=1734
  _COMBUSTIONCONTROLSTATUS._serialized_end=1816
  _RCUPRESSURE._serialized_start=1818
  _RCUPRESSURE._serialized_end=1919
  _RCUTEMPERATURE._serialized_start=1921
  _RCUTEMPERATURE._serialized_end=1987
  _NOSLOADCELL._serialized_start=1989
  _NOSLOADCELL._serialized_end=2040
  _RELAYSTATUS._serialized_start=2043
  _RELAYSTATUS._serialized_end=2265
  _PADBOXSTATUS._serialized_start=2267
  _PADBOXSTATUS._serialized_end=2359
  _LAUNCHRAILLOADCELL._serialized_start=2361
  _LAUNCHRAILLOADCELL._serialized_end=2402
  _SOBTEMPERATURE._serialized_start=2404
  _SOBTEMPERATURE._serialized_end=2470
# @@protoc_insertion_point(module_scope)
